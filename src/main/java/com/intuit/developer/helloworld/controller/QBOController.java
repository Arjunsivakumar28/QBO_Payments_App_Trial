package com.intuit.developer.helloworld.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.apache.commons.lang.RandomStringUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.intuit.developer.helloworld.client.OAuth2PlatformClientFactory;
import com.intuit.developer.helloworld.helper_old.QBOServiceHelper;
import com.intuit.ipp.data.CompanyInfo;
import com.intuit.ipp.data.Invoice;
import com.intuit.ipp.data.Error;
import com.intuit.ipp.exception.FMSException;
import com.intuit.ipp.exception.InvalidTokenException;
import com.intuit.ipp.services.DataService;
import com.intuit.ipp.services.QueryResult;
import com.intuit.oauth2.client.OAuth2PlatformClient;
import com.intuit.oauth2.data.BearerTokenResponse;
import com.intuit.oauth2.exception.OAuthException;

/**
 * @author dderose
 *
 */
@Controller
public class QBOController {
	
	@Autowired
	OAuth2PlatformClientFactory factory;
	
	@Autowired
    public QBOServiceHelper helper;

	
	private static final Logger logger = Logger.getLogger(QBOController.class);
	private static final String failureMsg="Failed";
	
	
	/**
     * Sample QBO API call using OAuth2 tokens
     * 
     * @param session
     * @return
     */
	@ResponseBody
    @RequestMapping("/getCompanyInfo")
    public String callQBOCompanyInfo(HttpSession session) {

    	String realmId = (String)session.getAttribute("realmId");
    	if (StringUtils.isEmpty(realmId)) {
    		return new JSONObject().put("response","No realm ID.  QBO calls only work if the accounting scope was passed!").toString();
    	}
    	String accessToken = (String)session.getAttribute("access_token");
    	
        try {
        	
        	
        	//get DataService
    		DataService service = helper.getDataService(realmId, accessToken);
			
			// get all companyinfo
			String sql = "select * from companyinfo";
			QueryResult queryResult = service.executeQuery(sql);
			return processResponseCompany(failureMsg, queryResult);
			
		}
	        /*
	         * Handle 401 status code - 
	         * If a 401 response is received, refresh tokens should be used to get a new access token,
	         * and the API call should be tried again.
	         */
	        catch (InvalidTokenException e) {			
				logger.error("Error while calling executeQuery :: " + e.getMessage());
				
				//refresh tokens
	        	logger.info("received 401 during companyinfo call, refreshing tokens now");
	        	OAuth2PlatformClient client  = factory.getOAuth2PlatformClient();
	        	String refreshToken = (String)session.getAttribute("refresh_token");
	        	
				try {
					BearerTokenResponse bearerTokenResponse = client.refreshToken(refreshToken);
					session.setAttribute("access_token", bearerTokenResponse.getAccessToken());
		            session.setAttribute("refresh_token", bearerTokenResponse.getRefreshToken());
		            
		            //call company info again using new tokens
		            logger.info("calling companyinfo using new tokens");
		            DataService service = helper.getDataService(realmId, accessToken);
					
					// get all companyinfo
					String sql = "select * from companyinfo";
					QueryResult queryResult = service.executeQuery(sql);
					return processResponseCompany(failureMsg, queryResult);
					
				} catch (OAuthException e1) {
					logger.error("Error while calling bearer token :: " + e.getMessage());
					return new JSONObject().put("response",failureMsg).toString();
				} catch (FMSException e1) {
					logger.error("Error while calling company currency :: " + e.getMessage());
					return new JSONObject().put("response",failureMsg).toString();
				}
	            
			} catch (FMSException e) {
				List<Error> list = e.getErrorList();
				list.forEach(error -> logger.error("Error while calling executeQuery :: " + error.getMessage()));
				return new JSONObject().put("response",failureMsg).toString();
			}
		
    }

	/**
     * Sample QBO API call using OAuth2 tokens
     * 
     * @param session
     * @return
     */
	@ResponseBody
    @RequestMapping("/getInvoice")
    public String callQBOInvoiceInfo(HttpSession session) {

    	String realmId = (String)session.getAttribute("realmId");
    	if (StringUtils.isEmpty(realmId)) {
    		return new JSONObject().put("response","No realm ID.  QBO calls only work if the accounting scope was passed!").toString();
    	}
    	String accessToken = (String)session.getAttribute("access_token");
    	
        try {
        	
        	
        	//get DataService
    		DataService service = helper.getDataService(realmId, accessToken);
			
			// get all companyinfo
			String sql = "select * from invoice";
			QueryResult queryResult = service.executeQuery(sql);
			return processResponseInvocie(failureMsg, queryResult, service);
			
		}
	        /*
	         * Handle 401 status code - 
	         * If a 401 response is received, refresh tokens should be used to get a new access token,
	         * and the API call should be tried again.
	         */
	        catch (InvalidTokenException e) {			
				logger.error("Error while calling executeQuery :: " + e.getMessage());
				
				//refresh tokens
	        	logger.info("received 401 during companyinfo call, refreshing tokens now");
	        	OAuth2PlatformClient client  = factory.getOAuth2PlatformClient();
	        	String refreshToken = (String)session.getAttribute("refresh_token");
	        	
				try {
					BearerTokenResponse bearerTokenResponse = client.refreshToken(refreshToken);
					session.setAttribute("access_token", bearerTokenResponse.getAccessToken());
		            session.setAttribute("refresh_token", bearerTokenResponse.getRefreshToken());
		            
		            //call company info again using new tokens
		            logger.info("calling companyinfo using new tokens");
		            DataService service = helper.getDataService(realmId, accessToken);
					
					// get all companyinfo
					String sql = "select * from invoice";
					QueryResult queryResult = service.executeQuery(sql);
					return processResponseInvocie(failureMsg, queryResult, service);
					
				} catch (OAuthException e1) {
					logger.error("Error while calling bearer token :: " + e.getMessage());
					return new JSONObject().put("response",failureMsg).toString();
				} catch (FMSException e1) {
					logger.error("Error while calling company currency :: " + e.getMessage());
					return new JSONObject().put("response",failureMsg).toString();
				}
	            
			} catch (FMSException e) {
				List<Error> list = e.getErrorList();
				list.forEach(error -> logger.error("Error while calling executeQuery :: " + error.getMessage()));
				return new JSONObject().put("response",failureMsg).toString();
			}
		
    }

	private String processResponseCompany(String failureMsg, QueryResult queryResult) {
		if (!queryResult.getEntities().isEmpty() && queryResult.getEntities().size() > 0) {
			CompanyInfo companyInfo = (CompanyInfo) queryResult.getEntities().get(0);
			logger.info("Companyinfo -> CompanyName: " + companyInfo.getCompanyName());
			ObjectMapper mapper = new ObjectMapper();
			try {
				return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(companyInfo);
			} catch (JsonProcessingException e) {
				logger.error("Exception while getting company info ", e);
				return new JSONObject().put("response",failureMsg).toString();
			}
			
		}
		return failureMsg;
	}

	private String processResponseInvocie(String failureMsg, QueryResult queryResult, DataService service) {
		if (!queryResult.getEntities().isEmpty() && queryResult.getEntities().size() > 0) {

			Invoice invoice = (Invoice) queryResult.getEntities().get(0);
			logger.info("Invoice before updated: " + invoice.getId() + " doc num ::: " + invoice.getDocNumber() );
			Invoice savedInvoice = invoice;
			try {
				invoice.setDocNumber("OMG It worked!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
				savedInvoice = service.update(invoice);
				logger.info("Invoice after updated: " + savedInvoice.getId() + " doc num ::: " + savedInvoice.getDocNumber() );
			
			} catch (FMSException e) {
				logger.info("FMS exception has struck here !!!!!!! " + e);
			}
			ObjectMapper mapper = new ObjectMapper();
			try {
				logger.info("invoice -> invoice status : " + invoice.getInvoiceStatus() );
				logger.info("invoice -> invoice id : " + invoice.getId() );
				logger.info("invoice -> invoice txn status : " + invoice.getTxnStatus() );
				logger.info("invoice -> invoice customer ref : " + invoice.getCustomerRef().toString() );
				logger.info("invoice -> invoice customer line : " + invoice.getLine().toString() );
				logger.info("invoice -> invoice check payment : " + invoice.getCheckPayment() );
				logger.info("invoice -> invoice currency ref : " + invoice.getCurrencyRef() );
				return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(savedInvoice);
			} catch (JsonProcessingException e) {
				logger.error("Exception while getting company info ", e);
				return new JSONObject().put("response",failureMsg).toString();
			}
			
		}
		return failureMsg;
	}



    
}
