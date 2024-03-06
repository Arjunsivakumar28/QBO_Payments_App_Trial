package com.intuit.developer.helloworld.payment;

import java.text.ParseException;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.intuit.developer.helloworld.client.OAuth2PlatformClientFactory;
import com.intuit.developer.helloworld.helper_old.QBOServiceHelper;

import com.intuit.developer.helloworld.helper_new.PaymentHelper;
import com.intuit.ipp.data.Error;
import com.intuit.ipp.data.Payment;
import com.intuit.ipp.exception.FMSException;
import com.intuit.ipp.services.DataService;
import com.intuit.ipp.services.QueryResult;
import com.intuit.ipp.util.Logger;
import com.intuit.oauth2.client.OAuth2PlatformClient;
import com.intuit.oauth2.data.BearerTokenResponse;
import com.intuit.oauth2.exception.OAuthException;
import com.intuit.ipp.exception.InvalidTokenException;

/**
 * Demonstrates methods to delete payment
 * Note: We'll create an entity first and then delete the same
 * 
 * @author dderose
 *
 */
@Controller
public class PaymentDelete {

	@Autowired
	OAuth2PlatformClientFactory factory;

	@Autowired
	QBOServiceHelper helper;

	private static final org.slf4j.Logger LOG = Logger.getLogger();
	private static final String failureMsg = "Failed";

	@ResponseBody
	@RequestMapping("/deletePayment")
	public String main(String[] args, HttpSession session) {
		try {
			return deletePayment(session);
		} catch (Exception e) {
			LOG.error("Error during CRUD", e.getCause());
			return ("error during CRUD");
		}
	}

	public String deletePayment(HttpSession session) throws FMSException, ParseException {

		String realmId = (String) session.getAttribute("realmId");
		if (StringUtils.isEmpty(realmId)) {
			return new JSONObject()
					.put("response", "No realm ID.  QBO calls only work if the accounting scope was passed!")
					.toString();
		}

		String accessToken = (String) session.getAttribute("access_token");

		try {
			DataService service = helper.getDataService(realmId, accessToken);

			// get All Payment
			Payment payment = PaymentHelper.getPayments(service);

			// delete First Payment
			Payment deletedPayment = service.delete(payment);
			LOG.info("Payment deleted : " + deletedPayment.getId());

			// Check and query all payments
			String sql = "select * from payment";
			QueryResult queryResult = service.executeQuery(sql);

			int count = queryResult.getEntities().size();
			LOG.info("Total number of payments: " + count);

			return processResponsePayment(failureMsg, queryResult);

		} catch (InvalidTokenException e) {
			String refreshToken = (String) session.getAttribute("refresh_token");
			OAuth2PlatformClient client = factory.getOAuth2PlatformClient();
			try {

				// Refresh tokens and try again
				BearerTokenResponse bTokenResponse = client.refreshToken(refreshToken);
				session.setAttribute("refresh_token", bTokenResponse.getRefreshToken());
				session.setAttribute("access_token", bTokenResponse.getAccessToken());

				accessToken = (String) session.getAttribute("access_token");

				DataService service = helper.getDataService(realmId, accessToken);

				// get Payment
				Payment payment = PaymentHelper.getPaymentFields(service);

				// delete Payment
				Payment deletedPayment = service.delete(payment);
				LOG.info("Payment deleted : " + deletedPayment.getId());

				// get all Payments
				String sql = "select * from payment";
				QueryResult queryResult = service.executeQuery(sql);
				int count = queryResult.getEntities().size();

				LOG.info("Total number of payments: " + count);

				return processResponsePayment(failureMsg, queryResult);

			} catch (OAuthException e1) {
				LOG.error("Error while calling bearer token :: " + e.getMessage());
				return new JSONObject().put("response", failureMsg).toString();
			} catch (FMSException e1) {
				LOG.error("Error while calling company currency :: " + e.getMessage());
				return new JSONObject().put("response", failureMsg).toString();
			}

		} catch (FMSException e) {
			List<Error> list = e.getErrorList();
			list.forEach(error -> LOG.error("Error while calling entity add:: " + error.getMessage()));
			return ("a bunch of wierd errors");
		}
	}

	private static String processResponsePayment(String failureMsg, QueryResult queryResult) {
		if (!queryResult.getEntities().isEmpty() && queryResult.getEntities().size() > 0) {

			ObjectMapper mapper = new ObjectMapper();
			String resultString = "";
			try {
				for (int i = 0; i < queryResult.getEntities().size(); i++) {
					if (i == queryResult.getEntities().size() - 1) {
						resultString += mapper.writeValueAsString(queryResult.getEntities().get(i));
					} else {
						resultString += mapper.writeValueAsString(queryResult.getEntities().get(i)) + " /// ";
					}
				}
				LOG.info("query result entities size (number of Payments) : " + queryResult.getEntities().size());
				return resultString;

			} catch (JsonProcessingException e) {
				LOG.error("Exception while getting company info ", e);
				return new JSONObject().put("response", failureMsg).toString();
			}

		}
		return failureMsg;
	}
}
