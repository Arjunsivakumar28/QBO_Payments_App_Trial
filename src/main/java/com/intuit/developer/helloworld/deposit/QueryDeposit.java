package com.intuit.developer.helloworld.deposit;

import javax.servlet.http.HttpSession;

import java.io.FileWriter;
import java.io.IOException;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.intuit.developer.helloworld.client.OAuth2PlatformClientFactory;
import com.intuit.developer.helloworld.helper_old.QBOServiceHelper;

import com.intuit.ipp.exception.FMSException;
import com.intuit.ipp.services.DataService;
import com.intuit.ipp.services.QueryResult;
import com.intuit.ipp.util.Logger;
import com.intuit.oauth2.data.BearerTokenResponse;
import com.intuit.oauth2.client.OAuth2PlatformClient;
import com.intuit.oauth2.exception.OAuthException;

/*
 * Query list of customers from API
 */
@Controller
public class QueryDeposit {

    @Autowired
    QBOServiceHelper helper;

    @Autowired
    OAuth2PlatformClientFactory factory;

    @ResponseBody
    @RequestMapping("/depositList")
    public String main(String[] args, HttpSession session) {
        try {
            return queryAllDeposits(session);
        } catch (Exception e) {
            return "! Error during Crud operation : " + e;
        }
    }
    
    public String queryAllDeposits(HttpSession session) throws FMSException, OAuthException {
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

            String sql = "select * from Deposit";

            QueryResult queryResult = dataService.executeQuery(sql);

            ObjectMapper mapper = new ObjectMapper();

            String result = "";

            if (!queryResult.getEntities().isEmpty()) {
                for (int i = 0; i < queryResult.getEntities().size(); i++) {
                    if (i == queryResult.getEntities().size() - 1) {
                        result += mapper.writeValueAsString(queryResult.getEntities().get(i));
                    } else {
                        result += mapper.writeValueAsString(queryResult.getEntities().get(i)) + " /// ";   
                    }
                }
                return result;
            } else {
                return "! the size of the query result of deposit is empty!!!";
            }

        } catch (FMSException e) {
            return "! An error during getting the customers query : " + e.getMessage();
        } catch (JsonProcessingException e) {
            return "! An error with processing the individual JSON objects of the query result using object mapper : " + e;
        }

    }
    
}
