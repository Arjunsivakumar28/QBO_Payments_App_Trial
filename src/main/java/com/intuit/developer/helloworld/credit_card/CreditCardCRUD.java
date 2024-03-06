package com.intuit.developer.helloworld.credit_card;

import java.io.FileWriter;
import java.io.IOException;
import java.util.UUID;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import javax.servlet.http.HttpSession;

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
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.intuit.developer.helloworld.client.OAuth2PlatformClientFactory;

import com.intuit.oauth2.client.OAuth2PlatformClient;
import com.intuit.oauth2.data.BearerTokenResponse;

import com.intuit.ipp.exception.FMSException;
import com.intuit.ipp.services.DataService;
import com.intuit.ipp.services.QueryResult;
import com.intuit.oauth2.exception.OAuthException;

import com.intuit.ipp.util.Logger;

@Controller("OgCreditCardCRUD")
public class CreditCardCRUD {

    @Autowired
    QBOServiceHelper helper;

    @Autowired
    OAuth2PlatformClientFactory factory;

    private static final org.slf4j.Logger LOG = Logger.getLogger();

    @ResponseBody
    @RequestMapping("/creditCardGet")
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

        String firstName = "";
        String lastName = "";

        try {
            DataService dataService = helper.getDataService(realmId, accessToken);

            String sql = "select * from Customer where id = '2'";

            QueryResult queryResult = dataService.executeQuery(sql);

            ObjectMapper mapper = new ObjectMapper();

            String result = "";

            if (!queryResult.getEntities().isEmpty() && queryResult.getEntities().size() == 1) {
                result += mapper.writeValueAsString(queryResult.getEntities().get(0));
            }

            JSONObject customer = new JSONObject(result);

            firstName = customer.getString("givenName");

            lastName = customer.getString("familyName");

        } catch (FMSException e) {
            return "! An error during getting the customers query : " + e.getMessage();
        } catch (JsonProcessingException e) {
            return "! An error with processing the individual JSON objects of the query result using object mapper : " + e;
        }

        String url = "https://sandbox.api.intuit.com/quickbooks/v4/customers/{param}/cards";

        // Create new unique request Id for request header
        String requestId = UUID.randomUUID().toString();

        HttpHeaders headers = new HttpHeaders();
        // ALLL I HAD TO DO WAS ADD THIS LINE
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("request-Id", requestId);
        headers.set("Authorization", "Bearer " + accessToken);

        // Card card = new Card();
        // card.setName(firstName + " " + lastName);
        // card.setNumber("4112344112344113");
        // card.setExpMonth("03");
        // card.setExpYear("2028");
        // card.setCvc("999");

        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        RestTemplate restTemplate = new RestTemplate();

        String param = "2";

        ResponseEntity<String> res = restTemplate.exchange(url, HttpMethod.GET, requestEntity, String.class, param);
        
        String code = Integer.toString(res.getStatusCode().value());

        String head = res.getHeaders().toString();

        String response = res.getBody();

        return response;

    }

}
