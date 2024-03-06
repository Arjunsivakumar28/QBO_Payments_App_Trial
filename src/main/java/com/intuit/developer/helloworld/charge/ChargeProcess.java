package com.intuit.developer.helloworld.charge;

import java.io.FileWriter;
import java.io.IOException;

import java.util.UUID;
import java.util.List;
import java.util.ArrayList;

import javax.servlet.http.HttpSession;

import org.json.JSONObject;

import java.text.ParseException;

import java.math.BigDecimal;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.apache.commons.lang.RandomStringUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

import com.intuit.developer.helloworld.helper_old.QBOServiceHelper;
import com.intuit.developer.helloworld.client.OAuth2PlatformClientFactory;
import com.intuit.developer.helloworld.credit_card.Card;
import com.intuit.developer.helloworld.helper_new.AccountHelper;
import com.intuit.developer.helloworld.helper_new.PaymentHelper;
import com.intuit.developer.helloworld.helper_new.SalesReceiptHelper;
import com.intuit.developer.helloworld.tokenization.CardCarrier;
import com.intuit.developer.helloworld.tokenization.Token;
import com.intuit.ipp.data.Account;
import com.intuit.ipp.data.CreditCardPayment;
import com.intuit.ipp.data.CreditChargeInfo;
import com.intuit.ipp.data.CreditChargeResponse;
import com.intuit.ipp.data.Invoice;
import com.intuit.ipp.data.Line;
import com.intuit.ipp.data.LineDetailTypeEnum;
import com.intuit.ipp.data.LinkedTxn;
import com.intuit.ipp.data.Payment;
import com.intuit.ipp.data.PaymentMethod;
import com.intuit.ipp.data.Deposit;
import com.intuit.ipp.data.DepositLineDetail;
import com.intuit.ipp.data.SalesReceipt;
import com.intuit.ipp.data.TxnTypeEnum;
import com.intuit.ipp.data.ReferenceType;
import com.intuit.ipp.exception.FMSException;
import com.intuit.ipp.services.DataService;
import com.intuit.ipp.services.QueryResult;
import com.intuit.ipp.util.Logger;
import com.intuit.ipp.util.DateUtils;
import com.intuit.oauth2.client.OAuth2PlatformClient;
import com.intuit.oauth2.data.BearerTokenResponse;
import com.intuit.oauth2.exception.OAuthException;

@Controller
public class ChargeProcess {

    @Autowired
    OAuth2PlatformClientFactory factory;

    @Autowired
    QBOServiceHelper helper;

    private static final org.slf4j.Logger LOG = Logger.getLogger();

    @ResponseBody
    @RequestMapping("/chargeProcess")
    public String main(String[] args, HttpSession session, @RequestParam("id") String id,
        @RequestParam("amt") String amt, @RequestBody String cardString) {

        try {
            JSONObject cardJsonObject = new JSONObject(cardString);
            Card card = new Card();
            card.setName(cardJsonObject.getString("name"));
            card.setNumber(cardJsonObject.getString("number"));
            card.setCvc(cardJsonObject.getString("cvv"));
            card.setExpMonth(cardJsonObject.getString("exp_month"));
            card.setExpYear(cardJsonObject.getString("exp_year"));

            String responseCardObjJsonString = "";
            ObjectMapper mapper = new ObjectMapper();

            CardCarrier carrierResponseCardObj = new CardCarrier();
            carrierResponseCardObj.setCard(card);

            responseCardObjJsonString = mapper.writeValueAsString(carrierResponseCardObj);
            return cardToken(responseCardObjJsonString, session, id, amt);
        } catch (Exception e) {
            LOG.error("! exception during credit card CRUD operation : ", e.getMessage());
            return "! exception during credit card CRUD operation : " + e.getMessage();
        }
    }

    // public String creditCardCheck(HttpSession session, String id, String amt) {

    //     String realmId = (String) session.getAttribute("realmId");
    //     if (StringUtils.isEmpty(realmId)) {
    //         return new JSONObject().put("response", "no realm ID. You messed up something somewhere").toString();
    //     }
    //     String refreshToken = (String) session.getAttribute("refresh_token");
    //     String accessToken = (String) session.getAttribute("access_token");

    //     OAuth2PlatformClient client = factory.getOAuth2PlatformClient();
    //     try {
    //         BearerTokenResponse bearerTokenResponse = client.refreshToken(refreshToken);

    //         accessToken = bearerTokenResponse.getAccessToken();
    //         refreshToken = bearerTokenResponse.getRefreshToken();

    //         session.setAttribute("refresh_token", refreshToken);
    //         session.setAttribute("access_token", accessToken);

    //         FileWriter fileWriter = new FileWriter("code.txt");
    //         fileWriter.write(refreshToken);
    //         fileWriter.close();

    //     } catch (OAuthException e) {
    //         return "! an Oauth exception was thrown " + e.getMessage();
    //     } catch (IOException e) {
    //         return "writing to file failed : " + e.getMessage();
    //     }

    //     String url = "https://sandbox.api.intuit.com/quickbooks/v4/customers/{param}/cards";

    //     // Create new unique request Id for request header
    //     String requestId = UUID.randomUUID().toString();

    //     HttpHeaders headers = new HttpHeaders();
    //     // ALLL I HAD TO DO WAS ADD THIS LINE
    //     headers.setContentType(MediaType.APPLICATION_JSON);
    //     headers.set("request-Id", requestId);
    //     headers.set("Authorization", "Bearer " + accessToken);

    //     HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

    //     RestTemplate restTemplate = new RestTemplate();

    //     String param = "2";

    //     ResponseEntity<Card[]> res = restTemplate.exchange(url, HttpMethod.GET, requestEntity, Card[].class, param);
    //     Card[] response = res.getBody();
    //     // -------------------------------------------------------------------------------
    //     try {
    //         response[0].setCvc("999");
    //         response[0].setNumber("4112344112344113");   

    //     } catch (NullPointerException e) {
    //         return "! credit card object not found " + e.getMessage();
    //     }
        
    //     String responseCardObjJsonString = "";
    //     ObjectMapper mapper = new ObjectMapper();

    //     CardCarrier carrierResponseCardObj = new CardCarrier();
    //     carrierResponseCardObj.setCard(response[0]);

    //     try {
    //         responseCardObjJsonString = mapper.writeValueAsString(carrierResponseCardObj);
    //     } catch (JsonProcessingException e) {
    //         return "! a json processing exception happened here : " + e;
    //     }

    //     return cardToken(responseCardObjJsonString, session, id, amt);
    // }

    public String cardToken(String card, HttpSession session, String id, String amt) {

        String realmId = (String) session.getAttribute("realmId");
        if (StringUtils.isEmpty(realmId)) {
            return new JSONObject().put("response", "no realm ID. You messed up something somewhere").toString();
        }
        String refreshToken = (String) session.getAttribute("refresh_token");
        String accessToken = (String) session.getAttribute("access_token");

        OAuth2PlatformClient client = factory.getOAuth2PlatformClient();
        try {
            BearerTokenResponse bearerTokenResponse = client.refreshToken(refreshToken);

            accessToken = bearerTokenResponse.getAccessToken();
            refreshToken = bearerTokenResponse.getRefreshToken();

            session.setAttribute("refresh_token", refreshToken);
            session.setAttribute("access_token", accessToken);

            FileWriter fileWriter = new FileWriter("code.txt");
            fileWriter.write(refreshToken);
            fileWriter.close();

        } catch (OAuthException e) {
            return "! an Oauth exception was thrown " + e.getMessage();
        } catch (IOException e) {
            return "! writing to file failed : " + e;
        }
        
        RestTemplate restTemplateToken = new RestTemplate();

        String urlToken = "https://sandbox.api.intuit.com/quickbooks/v4/payments/tokens";

        String requestIdToken = UUID.randomUUID().toString();

        HttpHeaders headersToken = new HttpHeaders();

        // ALLL I HAD TO DO WAS ADD THIS LINE
        headersToken.setContentType(MediaType.APPLICATION_JSON);

        headersToken.set("request-Id", requestIdToken);
        headersToken.set("Authorization", "Bearer " + accessToken);

        HttpEntity<String> requestEntityToken = new HttpEntity<>(card, headersToken);

        ResponseEntity<Token> resToken = restTemplateToken.exchange(urlToken, HttpMethod.POST, requestEntityToken, Token.class);
        
        Token responseToken = resToken.getBody();

        String token = responseToken.getValue();

        return chargeProcessCheck(session, token, id, amt);

    }

    public String chargeProcessCheck(HttpSession session, String token, String id, String amt) {
        String realmId = (String) session.getAttribute("realmId");
        if (StringUtils.isEmpty(realmId)) {
            return new JSONObject().put("response", "no realm ID. You messed up something somewhere").toString();
        }
        String refreshToken = (String) session.getAttribute("refresh_token");
        String accessToken = (String) session.getAttribute("access_token");

        OAuth2PlatformClient client = factory.getOAuth2PlatformClient();
        try {
            BearerTokenResponse bearerTokenResponse = client.refreshToken(refreshToken);

            accessToken = bearerTokenResponse.getAccessToken();
            refreshToken = bearerTokenResponse.getRefreshToken();

            session.setAttribute("refresh_token", refreshToken);
            session.setAttribute("access_token", accessToken);

            FileWriter fileWriter = new FileWriter("code.txt");
            fileWriter.write(refreshToken);
            fileWriter.close();

        } catch (OAuthException e) {
            return "! an Oauth exception was thrown " + e.getMessage();
        } catch (IOException e) {
            return "writing to file failed : " + e;
        }

        String url = "https://sandbox.api.intuit.com/quickbooks/v4/payments/charges";
        
        RestTemplate restTemplate = new RestTemplate();

        String requestId = UUID.randomUUID().toString();

        HttpHeaders headers = new HttpHeaders();

        // ALLL I HAD TO DO WAS ADD THIS LINE   
        headers.setContentType(MediaType.APPLICATION_JSON); 

        headers.set("request-Id", requestId);
        headers.set("Authorization", "Bearer " + accessToken);

        String body = "{\"amount\": \""+amt+"\",\"currency\": \"USD\",\"context\": {\"mobile\": \"false\",\"isEcommerce\": \"true\"},\"capture\": \"false\",\"token\": \""+ token +"\"}";

        HttpEntity<String> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);

        String responseString = responseEntity.getBody();

        JSONObject chargeJsonObj = new JSONObject(responseString);

        String chargeId = chargeJsonObj.getString("id");

        return captureProcessCheck(session, chargeId, id, amt);

    }

    public String captureProcessCheck(HttpSession session, String chargeId, String id, String amt) {
        String realmId = (String) session.getAttribute("realmId");
        if (StringUtils.isEmpty(realmId)) {
            return new JSONObject().put("response", "no realm ID. You messed up something somewhere").toString();
        }
        String refreshToken = (String) session.getAttribute("refresh_token");
        String accessToken = (String) session.getAttribute("access_token");

        OAuth2PlatformClient client = factory.getOAuth2PlatformClient();
        try {
            BearerTokenResponse bearerTokenResponse = client.refreshToken(refreshToken);

            accessToken = bearerTokenResponse.getAccessToken();
            refreshToken = bearerTokenResponse.getRefreshToken();

            session.setAttribute("refresh_token", refreshToken);
            session.setAttribute("access_token", accessToken);

            FileWriter fileWriter = new FileWriter("code.txt");
            fileWriter.write(refreshToken);
            fileWriter.close();

        } catch (OAuthException e) {
            return "! an Oauth exception was thrown " + e.getMessage();
        } catch (IOException e) {
            return "writing to file failed : " + e;
        }

        String url = "https://sandbox.api.intuit.com/quickbooks/v4/payments/charges/{id}/capture";
        
        RestTemplate restTemplate = new RestTemplate();

        String requestId = UUID.randomUUID().toString();

        HttpHeaders headers = new HttpHeaders();

        // ALLL I HAD TO DO WAS ADD THIS LINE   
        headers.setContentType(MediaType.APPLICATION_JSON); 

        headers.set("request-Id", requestId);
        headers.set("Authorization", "Bearer " + accessToken);

        String body = "{\"amount\": \""+amt+"\",\"context\": {\"mobile\": \"false\",\"isEcommerce\": \"true\"}}";

        HttpEntity<String> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class, chargeId);

        String responseString = responseEntity.getBody();

        JSONObject captureObj = new JSONObject(responseString);

        return createPayment(session, captureObj, id, amt);
    }
    
    public String createPayment(HttpSession session, JSONObject captureObj, String id, String amt) {
        String realmId = (String) session.getAttribute("realmId");
        if (StringUtils.isEmpty(realmId)) {
            return new JSONObject().put("response", "no realm ID. You messed up something somewhere").toString();
        }
        String refreshToken = (String) session.getAttribute("refresh_token");
        String accessToken = (String) session.getAttribute("access_token");

        OAuth2PlatformClient client = factory.getOAuth2PlatformClient();
        try {
            BearerTokenResponse bearerTokenResponse = client.refreshToken(refreshToken);

            accessToken = bearerTokenResponse.getAccessToken();
            refreshToken = bearerTokenResponse.getRefreshToken();

            session.setAttribute("refresh_token", refreshToken);
            session.setAttribute("access_token", accessToken);

            FileWriter fileWriter = new FileWriter("code.txt");
            fileWriter.write(refreshToken);
            fileWriter.close();

        } catch (OAuthException e) {
            return "! an Oauth exception was thrown " + e.getMessage();
        } catch (IOException e) {
            return "! writing to file failed : " + e;
        }

        try {
            DataService dataService = helper.getDataService(realmId, accessToken);

            // create invoice
            String invoiceSql = "select * from Invoice where id = '"+id+"'";

            QueryResult queryResult = dataService.executeQuery(invoiceSql);

            Invoice invoice = new Invoice();

            if (!queryResult.getEntities().isEmpty() && queryResult.getEntities().size() == 1) {
                invoice = (Invoice) queryResult.getEntities().get(0);
            }

            // The check account reference
            ReferenceType accountRef = new ReferenceType();

            accountRef.setName("Checking");
            accountRef.setValue("35");

            // The payment method ref
            String paymentMethodSql = "select * from PaymentMethod where name = 'visa'";

            QueryResult paymentMethodQuery =  dataService.executeQuery(paymentMethodSql);

            PaymentMethod paymentMethod = (PaymentMethod) paymentMethodQuery.getEntities().get(0);

            ReferenceType paymentMethodRef = new ReferenceType();
            paymentMethodRef.setName(paymentMethod.getName());
            paymentMethodRef.setValue(paymentMethod.getId());

            Payment payment = new Payment();

            List<LinkedTxn> linkedTxnList = new ArrayList<LinkedTxn>();
            LinkedTxn linkedTxn = new LinkedTxn();
            linkedTxn.setTxnId(invoice.getId());
            linkedTxn.setTxnType(TxnTypeEnum.INVOICE.value());

            linkedTxnList.add(linkedTxn);
        
            Line line1 = new Line();
            line1.setAmount(new BigDecimal(amt));
            line1.setLinkedTxn(linkedTxnList);

            List<Line> lineList = new ArrayList<Line>();
            lineList.add(line1);
            payment.setLine(lineList);
            
            // SalesReceipt salesReceipt = SalesReceiptHelper.getSalesReceiptFields(dataService);

            CreditChargeInfo creditChargeInfo = new CreditChargeInfo();
            CreditChargeResponse creditChargeResponse = new CreditChargeResponse();

            creditChargeInfo.setProcessPayment(true);
            JSONObject card = captureObj.getJSONObject("card");
            creditChargeInfo.setNumber(card.getString("number"));
            creditChargeInfo.setType("Credit Card");
            creditChargeInfo.setAmount(new BigDecimal(captureObj.getString("amount")));
            creditChargeResponse.setCCTransId(captureObj.getString("id"));
            creditChargeResponse.setAuthCode(captureObj.getString("authCode"));

            CreditCardPayment creditCardPayment = new CreditCardPayment();

            creditCardPayment.setCreditChargeInfo(creditChargeInfo);
            creditCardPayment.setCreditChargeResponse(creditChargeResponse);

            payment.setCreditCardPayment(creditCardPayment);
            payment.setTxnSource("IntuitPayment");

            // salesReceipt.setCreditCardPayment(creditCardPayment);
            
            // salesReceipt.setTxnSource("IntuitPayment");

            // salesReceipt.setTotalAmt(new BigDecimal("85.00"));

            // salesReceipt.setLine(invoice.getLine());

            // salesReceipt.setCustomerRef(invoice.getCustomerRef());

            // salesReceipt.setDepositToAccountRef(accountRef);

            // dataService.add(salesReceipt);

            payment.setCustomerRef(invoice.getCustomerRef());

            payment.setDepositToAccountRef(accountRef);

            payment.setPaymentMethodRef(paymentMethodRef);

            payment.setTotalAmt(new BigDecimal(amt));

            payment.setUnappliedAmt(new BigDecimal("0"));

            payment.setDocNumber(RandomStringUtils.randomAlphanumeric(5));

            payment.setPaymentRefNum(RandomStringUtils.randomNumeric(5) + RandomStringUtils.randomAlphanumeric(1));

            dataService.add(payment);

            String paymentObjSql = "select * from Payment";

            QueryResult paymenQueryResult = dataService.executeQuery(paymentObjSql);

            Payment createdPayment = new Payment();

            if (!paymenQueryResult.getEntities().isEmpty()) {
                createdPayment = (Payment) paymenQueryResult.getEntities().get(0);
            } else {
                return "! an issue with the payment querry size or is empty or something";
            }

            String DepositObjSql = "select * from Deposit";

            QueryResult depositQueryResult = dataService.executeQuery(DepositObjSql);

            String result = "";

            ObjectMapper mapper = new ObjectMapper();

            for (int i = 0; i < depositQueryResult.getEntities().size(); i++) {
                if (i == depositQueryResult.getEntities().size() - 1) {
                    result += mapper.writeValueAsString(depositQueryResult.getEntities().get(i));
                } else {
                    result += mapper.writeValueAsString(depositQueryResult.getEntities().get(i)) + " /// ";
                }
            }

            return(result);

        } catch (FMSException e) {
            return "! An error during getting the customers query : " + e.getMessage();
        } catch (JsonProcessingException e) {
            return "! An error with processing the individual JSON objects of the query result using object mapper : " + e.getMessage();
        // } catch (ParseException e) {
        //     return "! An error during parsing information with sales receipt helper get fields : " + e.getMessage();
        // } catch (JsonProcessingException e) {
        //     return "! An error during parsing information with invoice get : " + e.getMessage();
        }

    }

    // public String depositCreate(HttpSession session, Payment payment) {
    //     String realmId = (String) session.getAttribute("realmId");
    //     if (StringUtils.isEmpty(realmId)) {
    //         return new JSONObject().put("response", "no realm ID. You messed up something somewhere").toString();
    //     }
    //     String refreshToken = (String) session.getAttribute("refresh_token");
    //     String accessToken = (String) session.getAttribute("access_token");

    //     OAuth2PlatformClient client = factory.getOAuth2PlatformClient();
    //     try {
    //         BearerTokenResponse bearerTokenResponse = client.refreshToken(refreshToken);

    //         accessToken = bearerTokenResponse.getAccessToken();
    //         refreshToken = bearerTokenResponse.getRefreshToken();

    //         session.setAttribute("refresh_token", refreshToken);
    //         session.setAttribute("access_token", accessToken);

    //         FileWriter fileWriter = new FileWriter("code.txt");
    //         fileWriter.write(refreshToken);
    //         fileWriter.close();

    //     } catch (OAuthException e) {
    //         return "! an Oauth exception was thrown " + e.getMessage();
    //     } catch (IOException e) {
    //         return "writing to file failed : " + e;
    //     }
    //     try {
    //         DataService dataService = helper.getDataService(realmId, accessToken);

    //         // Create Deposit 
    //         Deposit deposit = new Deposit();

    //         deposit.setTxnDate(DateUtils.getCurrentDateTime());

    //         // The check account reference
    //         ReferenceType depositAccountRef = new ReferenceType();

    //         depositAccountRef.setName("Checking");
    //         depositAccountRef.setValue("35"); 

    //         ReferenceType depositFromAccountRef = new ReferenceType();

    //         depositFromAccountRef.setName("Undeposited Funds");
    //         depositFromAccountRef.setValue("4");

    //         deposit.setDepositToAccountRef(depositAccountRef);

    //         deposit.setTotalAmt(new BigDecimal("1.00"));

    //         Line line1 = new Line();
    //         line1.setAmount(new BigDecimal("1.00"));
    //         line1.setDetailType(LineDetailTypeEnum.DEPOSIT_LINE_DETAIL);

    //         DepositLineDetail depositLineDetail = new DepositLineDetail();

    //         depositLineDetail.setAccountRef(depositFromAccountRef);
            
    //         line1.setDepositLineDetail(depositLineDetail);

    //         List<LinkedTxn> linkedTxn = new ArrayList<LinkedTxn>();
    //         LinkedTxn lTxn = new LinkedTxn();
    //         lTxn.setTxnId(payment.getId());
    //         lTxn.setTxnType("Payment");
    //         linkedTxn.add(lTxn);

    //         line1.setLinkedTxn(linkedTxn);
            
    //         List<Line> lineList = new ArrayList<Line>();
    //         lineList.add(line1);
    //         deposit.setLine(lineList);

    //         String result = "";

    //         ObjectMapper mapper = new ObjectMapper();

    //         String depositString = mapper.writeValueAsString(deposit);

    //         dataService.add(deposit);

    //         String depositSql = "select * from Deposit";

    //         QueryResult depositQueryResult = dataService.executeQuery(depositSql);

    //         if (!depositQueryResult.getEntities().isEmpty()) {
    //             for (int i = 0; i < depositQueryResult.getEntities().size(); i++) {
    //                 if (i == depositQueryResult.getEntities().size() - 1) {
    //                     result += mapper.writeValueAsString(depositQueryResult.getEntities().get(i));
    //                 } else {
    //                     result += mapper.writeValueAsString(depositQueryResult.getEntities().get(i)) + " /// ";   
    //                 }
    //             }
    //             return result;
    //         } else {
    //             return "! the size of the query result of deposit is empty!!!";
    //         }

    //     } catch (FMSException e) {
    //         return "! An error during getting the deposit query : " + e.getMessage();
    //     } catch (JsonProcessingException e) {
    //         return "! An error with processing the individual JSON objects of the query result using object mapper : " + e;
    //     } catch (ParseException e) {
    //         return "! An error during parsing information with deposit helper get fields : " + e.getMessage();
    //     }

    // }
}
