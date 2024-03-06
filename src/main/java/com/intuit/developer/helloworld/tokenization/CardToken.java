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
import com.intuit.developer.helloworld.credit_card.Card;

import com.intuit.ipp.exception.FMSException;
import com.intuit.ipp.util.Logger;
import com.intuit.oauth2.client.OAuth2PlatformClient;
import com.intuit.oauth2.data.BearerTokenResponse;
import com.intuit.oauth2.exception.OAuthException;

@Controller
public class CardToken {
    @Autowired
    QBOServiceHelper helper;

    @Autowired
    OAuth2PlatformClientFactory factory;

    private static final org.slf4j.Logger LOG = Logger.getLogger();

    @ResponseBody
    @RequestMapping("/cardToken")
    public String main(String[] args, HttpSession session) {
        try {
            return creditCardCheck(session);
        } catch (Exception e) {
            LOG.error("! exception during credit card CRUD operation : ", e);
            return "! exception during credit card CRUD operation : " + e;
        }
    }

    public String creditCardCheck(HttpSession session) {

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

        String url = "https://sandbox.api.intuit.com/quickbooks/v4/customers/{param}/cards";

        // Create new unique request Id for request header
        String requestId = UUID.randomUUID().toString();

        HttpHeaders headers = new HttpHeaders();
        headers.set("request-Id", requestId);
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        RestTemplate restTemplate = new RestTemplate();

        String param = "5";

        ResponseEntity<Card[]> res = restTemplate.exchange(url, HttpMethod.GET, requestEntity, Card[].class, param);
        Card[] response = res.getBody();
        // -------------------------------------------------------------------------------
        try {
            response[0].setCvc("123");
            response[0].setNumber("4111111111111111");
        } catch (NullPointerException e) {
            return "! credit card object not found " + e.getMessage();
        }
        
        
        String responseCardObjJsonString = "";
        ObjectMapper mapper = new ObjectMapper();

        CardCarrier carrierResponseCardObj = new CardCarrier();
        carrierResponseCardObj.setCard(response[0]);

        try {
            responseCardObjJsonString = mapper.writeValueAsString(carrierResponseCardObj);
        } catch (JsonProcessingException e) {
            return "! a json processing exception happened here : " + e;
        }

        return cardToken(responseCardObjJsonString, session);
    }

    public String cardToken(String card, HttpSession session) {

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

        ResponseEntity<String> resToken = restTemplateToken.exchange(urlToken, HttpMethod.POST, requestEntityToken, String.class);
        
        String responseToken = resToken.getBody();

        return responseToken;

    }

}
