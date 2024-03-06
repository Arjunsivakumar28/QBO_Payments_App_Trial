package com.intuit.developer.helloworld.sales_receipt;

import java.io.FileWriter;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.intuit.developer.helloworld.client.OAuth2PlatformClientFactory;
import com.intuit.developer.helloworld.helper_new.AccountHelper;
import com.intuit.developer.helloworld.helper_new.CustomerHelper;
import com.intuit.developer.helloworld.helper_new.ItemHelper;
import com.intuit.developer.helloworld.helper_new.SalesReceiptHelper;
import com.intuit.developer.helloworld.helper_new.TaxCodeInfo;
import com.intuit.developer.helloworld.helper_old.QBOServiceHelper;
import com.intuit.ipp.data.Account;
import com.intuit.ipp.data.Invoice;
import com.intuit.ipp.data.Customer;
import com.intuit.ipp.data.Item;
import com.intuit.ipp.data.Line;
import com.intuit.ipp.data.LineDetailTypeEnum;
import com.intuit.ipp.data.SalesItemLineDetail;
import com.intuit.ipp.data.SalesReceipt;
import com.intuit.ipp.data.TaxCode;
import com.intuit.ipp.data.CreditCardPayment;
import com.intuit.ipp.data.CreditChargeInfo;
import com.intuit.ipp.data.CreditChargeResponse;
import com.intuit.ipp.data.ReferenceType;
import com.intuit.ipp.exception.FMSException;
import com.intuit.ipp.services.DataService;
import com.intuit.ipp.services.QueryResult;
import com.intuit.ipp.data.ReferenceType;
import com.intuit.oauth2.client.OAuth2PlatformClient;
import com.intuit.oauth2.data.BearerTokenResponse;
import com.intuit.oauth2.exception.OAuthException;

@Controller
public class SalesReceiptCRUD {

    @Autowired
    QBOServiceHelper helper;

    @Autowired
    OAuth2PlatformClientFactory factory;

    @ResponseBody
    @RequestMapping("/salesReceiptCrud")
    public String main(String[] args, HttpSession session) {
        try {
            return salesReceiptCheck(session);
        } catch (Exception e) {
            return "! Error during Crud operation : " + e;
        }
    }
    
    public String salesReceiptCheck(HttpSession session) throws FMSException, OAuthException {
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
            
            SalesReceipt salesReceipt = SalesReceiptHelper.getSalesReceiptFields(dataService);

            String invoiceSql = "select * from Invoice where docNumber = 'wYFcu'";

            QueryResult queryResult = dataService.executeQuery(invoiceSql);

            Invoice invoice = new Invoice();

            if (!queryResult.getEntities().isEmpty() && queryResult.getEntities().size() == 1) {
                invoice = (Invoice) queryResult.getEntities().get(0);
            }

            CreditChargeInfo creditChargeInfo = new CreditChargeInfo();
            CreditChargeResponse creditChargeResponse = new CreditChargeResponse();

            creditChargeInfo.setProcessPayment(true);
            creditChargeResponse.setCCTransId("the id of charge");

            CreditCardPayment creditCardPayment = new CreditCardPayment();

            creditCardPayment.setCreditChargeInfo(creditChargeInfo);
            creditCardPayment.setCreditChargeResponse(creditChargeResponse);

            salesReceipt.setCreditCardPayment(creditCardPayment);
            salesReceipt.setTxnSource("IntuitPayment");

            salesReceipt.setTotalAmt(new BigDecimal("100.00"));

            salesReceipt.setLine(invoice.getLine());

            salesReceipt.setCustomerRef(invoice.getCustomerRef());

            dataService.add(salesReceipt);

            String salesReceiptSql = "select * from SalesReceipt";

            QueryResult salesReceipQueryResult = dataService.executeQuery(salesReceiptSql);

            String result = "";

            ObjectMapper mapper = new ObjectMapper();

            if (!salesReceipQueryResult.getEntities().isEmpty()) {
                for (int i = 0; i < salesReceipQueryResult.getEntities().size(); i++) {
                    if (i == salesReceipQueryResult.getEntities().size() - 1) {
                        result += mapper.writeValueAsString(salesReceipQueryResult.getEntities().get(i));
                    } else {
                        result += mapper.writeValueAsString(salesReceipQueryResult.getEntities().get(i)) + " /// ";   
                    }
                }
                return result;
            } else {
                return "! the size of the query result of customers is empty!!!";
            }

        } catch (FMSException e) {
            return "! An error during getting the customers query : " + e.getMessage();
        // } catch (JsonProcessingException e) {
        //     return "! An error with processing the individual JSON objects of the query result using object mapper : " + e;
        } catch (ParseException e) {
            return "! An error during parsing information with sales receipt helper get fields : " + e.getMessage();
        } catch (JsonProcessingException e) {
            return "! An error during parsing information with invoice get : " + e.getMessage();
        }

    }

    
}
