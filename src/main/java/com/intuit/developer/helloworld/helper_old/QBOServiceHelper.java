package com.intuit.developer.helloworld.helper_old;

import java.util.List;
import java.util.Map;
import  java.util.UUID;

import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.intuit.developer.helloworld.client.OAuth2PlatformClientFactory;
import com.intuit.ipp.net.MethodType;
import com.intuit.ipp.services.QueryResult;
import com.intuit.ipp.interceptors.IntuitMessage;
import com.intuit.ipp.data.IntuitResponse;
import com.intuit.ipp.data.QueryResponse;
import com.intuit.ipp.interceptors.RequestElements;
import com.intuit.ipp.core.Context;
import com.intuit.ipp.core.IEntity;
import com.intuit.ipp.core.ServiceType;
import com.intuit.ipp.data.Error;
import com.intuit.ipp.exception.FMSException;
import com.intuit.ipp.exception.InvalidTokenException;
import com.intuit.ipp.security.OAuth2Authorizer;
import com.intuit.ipp.services.DataService;
import com.intuit.ipp.services.QueryResult;
import com.intuit.ipp.util.Config;
import com.intuit.oauth2.client.OAuth2PlatformClient;
import com.intuit.oauth2.data.BearerTokenResponse;
import com.intuit.oauth2.exception.OAuthException;
import com.intuit.ipp.exception.FMSException;

@Service
public class QBOServiceHelper {
	
	@Autowired
	OAuth2PlatformClientFactory factory;

	private Context context = null;
	
	private static final Logger logger = Logger.getLogger(QBOServiceHelper.class);

	public DataService getDataService(String realmId, String accessToken) throws FMSException {
		
    	String url = factory.getPropertyValue("IntuitAccountingAPIHost") + "/v3/company";

		Config.setProperty(Config.BASE_URL_QBO, url);
		//create oauth object
		OAuth2Authorizer oauth = new OAuth2Authorizer(accessToken);
		//create context
		context = new Context(oauth, ServiceType.QBO, realmId);

		// create dataservice
		return new DataService(context);
	}

	public DataService getDataServicePayments(String realmId, String accessToken) throws FMSException {
		
    	String url = "https://sandbox.api.intuit.com/quickbooks/v4/customers";

		Config.setProperty(Config.BASE_URL_QBO, url);
		//create oauth object
		OAuth2Authorizer oauth = new OAuth2Authorizer(accessToken);
		//create context
		context = new Context(oauth, ServiceType.QBO, realmId);

		// create dataservice
		return new DataService(context);
	}

	public QueryResult getList(DataService dataService) throws FMSException {

		QueryResult queryResult = new QueryResult();

        IntuitMessage intuitMessage = new IntuitMessage();
        RequestElements requestElements = intuitMessage.getRequestElements();

        // Customer Id
        String customerId = "200161921532106731364534";

        // Create new unique request Id for request header
        String requestId = UUID.randomUUID().toString();

        // Create new request header of request ID
        Map<String, String> requestHeaders = requestElements.getRequestHeaders();
        requestHeaders.put("request-Id", requestId);

        // Set request parameters
        Map<String, String> requestParameters = requestElements.getRequestParameters();
        requestParameters.put(RequestElements.REQ_PARAM_ENTITY_ID, customerId);
        requestParameters.put(RequestElements.REQ_PARAM_METHOD_TYPE, MethodType.GET.toString());

		requestElements.setContext(context);

		return queryResult;
    }

	
    /**
     * Queries data from QuickBooks
     * 
     * @param session
     * @param sql
     * @return
     */
    public List<? extends IEntity> queryData(HttpSession session, String sql) {

    	String realmId = (String)session.getAttribute("realmId");
    	if (StringUtils.isEmpty(realmId)) {
    		logger.error("Relam id is null ");
    	}
    	String accessToken = (String)session.getAttribute("access_token");
    	
    	try {
        	
        	//get DataService
    		DataService service = getDataService(realmId, accessToken);
			
			// get data
			QueryResult queryResult = service.executeQuery(sql);
			return queryResult.getEntities();
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
		            DataService service = getDataService(realmId, accessToken);
					
					// get data
					QueryResult queryResult = service.executeQuery(sql);
					return queryResult.getEntities();
					 
				} catch (OAuthException e1) {
					logger.error("Error while calling bearer token :: " + e.getMessage());
					
				} catch (FMSException e1) {
					logger.error("Error while calling company currency :: " + e.getMessage());
				}
	            
			} catch (FMSException e) {
				List<Error> list = e.getErrorList();
				list.forEach(error -> logger.error("Error while calling executeQuery :: " + error.getMessage()));
			}
		return null;
    }
}
