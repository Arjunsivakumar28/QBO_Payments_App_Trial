package com.intuit.developer.helloworld.invoice;

import java.io.FileWriter;
import java.io.IOException;

import java.io.FileWriter;
import java.text.ParseException;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.intuit.developer.helloworld.client.OAuth2PlatformClientFactory;
import com.intuit.developer.helloworld.helper_old.QBOServiceHelper;

import com.intuit.developer.helloworld.helper_new.InvoiceHelper;
import com.intuit.ipp.data.Error;
import com.intuit.ipp.data.Invoice;
import com.intuit.ipp.exception.FMSException;
import com.intuit.ipp.services.DataService;
import com.intuit.ipp.services.QueryResult;
import com.intuit.ipp.util.Logger;
import com.intuit.oauth2.client.OAuth2PlatformClient;
import com.intuit.oauth2.data.BearerTokenResponse;
import com.intuit.oauth2.exception.OAuthException;
import com.intuit.ipp.exception.InvalidTokenException;

/**
 * Demonstrates methods to query invoice
 * 1. Query all records
 * 2. Query by id, note we'll add the entity first and then query
 * 
 * @author dderose
 *
 */
@Controller
public class QuerySingleInvoice {

	@Autowired
	OAuth2PlatformClientFactory factory;

	@Autowired
	QBOServiceHelper helper;

	private static final org.slf4j.Logger LOG = Logger.getLogger();

	@ResponseBody
	@RequestMapping("/querySingleInvoice")
	public String main(String[] args, HttpSession session, @RequestParam("id") String id) {
		try {
			return queryInvoice(session, id);
		} catch (Exception e) {
			LOG.error("Error during CRUD", e.getCause());
			return "error during crud";
		}
	}

	public String queryInvoice(HttpSession session, String id) throws FMSException, ParseException, OAuthException {
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

            String result = "";

            ObjectMapper mapper = new ObjectMapper();

            result += mapper.writeValueAsString(queryResult.getEntities().get(0));

            return result;

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
}
