package com.intuit.developer.helloworld.tokenization;

import java.io.FileWriter;
import java.io.IOException;
import java.util.UUID;

import javax.servlet.http.HttpSession;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

import com.intuit.developer.helloworld.helper_old.QBOServiceHelper;
import com.intuit.developer.helloworld.client.OAuth2PlatformClientFactory;
import com.intuit.developer.helloworld.BankAccount.BankAccount;
import com.intuit.ipp.exception.FMSException;
import com.intuit.ipp.util.Logger;
import com.intuit.oauth2.client.OAuth2PlatformClient;
import com.intuit.oauth2.data.BearerTokenResponse;
import com.intuit.oauth2.exception.OAuthException;

@Controller
public class BankAccountToken {
    @Autowired
    QBOServiceHelper helper;

    @Autowired
    OAuth2PlatformClientFactory factory;

    private static final org.slf4j.Logger LOG = Logger.getLogger();

    @ResponseBody
    @RequestMapping("/bankAccountToken")
    public String main(String[] args, HttpSession session) {
        try {
            return queryBankAccount(session);
        } catch (Exception e) {
            LOG.error("! Error during Payments API bank account object CRUD", e);
            return "! Error during Payments API bank account object CRUD" + e;
        }
    }

    public String queryBankAccount(HttpSession session) throws FMSException {

        String realmId = (String) session.getAttribute("realmId");
		if (StringUtils.isEmpty(realmId)) {
			return new JSONObject()
					.put("response", "No realm ID.  QBO calls only work if the accounting scope was passed!")
					.toString();
		}
		String accessToken = (String) session.getAttribute("access_token");

        String url = "https://sandbox.api.intuit.com/quickbooks/v4/customers/{param}/bank-accounts";

        // Create new unique request Id for request header
        String requestId = UUID.randomUUID().toString();

        HttpHeaders headers = new HttpHeaders();
        headers.set("request-Id", requestId);
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        RestTemplate restTemplate = new RestTemplate();

        String param = "4";

        ResponseEntity<BankAccount[]> res = restTemplate.exchange(url, HttpMethod.GET, requestEntity, BankAccount[].class, param);

        BankAccount[] response = res.getBody();

        // -------------------------------------------------------------------------------
        try {
            response[0].setAccountNumber("1234564534");
        } catch (NullPointerException e) {
            return "! bank account object not found " + e.getMessage();
        }
        
        
        String responseBankObjJsonString = "";
        ObjectMapper mapper = new ObjectMapper();

        BankAccountCarrier carrierResponseBankObj = new BankAccountCarrier();
        carrierResponseBankObj.setBankAccount(response[0]);

        try {
            responseBankObjJsonString = mapper.writeValueAsString(carrierResponseBankObj);
        } catch (JsonProcessingException e) {
            return "! a json processing exception happened here : " + e;
        }

        return bankAccountToken(responseBankObjJsonString, session);
    }

    public String bankAccountToken(String bankAccount, HttpSession session) {

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

        HttpEntity<String> requestEntityToken = new HttpEntity<>(bankAccount, headersToken);

        ResponseEntity<String> resToken = restTemplateToken.exchange(urlToken, HttpMethod.POST, requestEntityToken, String.class);
        
        String responseToken = resToken.getBody();

        return responseToken;

    }
}
