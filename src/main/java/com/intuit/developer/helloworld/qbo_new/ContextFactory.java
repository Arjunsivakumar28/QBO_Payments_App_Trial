package com.intuit.developer.helloworld.qbo_new;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import com.intuit.ipp.core.Context;
import com.intuit.ipp.core.ServiceType;
import com.intuit.ipp.exception.FMSException;
import com.intuit.ipp.security.IAuthorizer;
import com.intuit.ipp.security.OAuth2Authorizer;
import com.intuit.ipp.security.OAuthAuthorizer;
import com.intuit.ipp.util.Logger;

import com.intuit.oauth2.data.BearerTokenResponse;
import com.intuit.developer.helloworld.client.OAuth2PlatformClientFactory;
import com.intuit.oauth2.client.OAuth2PlatformClient;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 
 * @author dderose
 *
 */

public class ContextFactory {

	@Autowired
	static OAuth2PlatformClientFactory factory;

	private static final org.slf4j.Logger LOG = Logger.getLogger();

	private static final String companyID = "company.id";
	private static final String consumerKey = "consumer.key";
	private static final String consumerSecret = "consumer.secret";
	private static final String authCode = "oauth2.accessToken";
	private static final String accessTokenSecret = "oauth.accessTokenSecret";
	private static final String accessToken = "oauth2.accessToken";
	private static final String refreshToken = "oauth2.refreshToken";
	

	private static Properties prop;
	
	
	/**
	 * Initializes Context for a given app/company profile
	 * 
	 * @return
	 * @throws FMSException
	 */
	public static Context getContext() throws FMSException {
		
		try {
			loadProperties();
		} catch (IOException e) {
			LOG.error("Error while loading properties", e.getCause());
		}
		//create oauth object
		OAuth2Authorizer oauth = new OAuth2Authorizer(prop.getProperty(accessToken));
		//create context
		Context context = new Context(oauth, ServiceType.QBO, prop.getProperty(companyID));
		
		return context;
	}
	
	private static void loadProperties() throws IOException {
		 
		try {
			prop = new Properties();
			String propFileName = "config.properties";
 
			InputStream inputStream = ContextFactory.class.getClassLoader().getResourceAsStream(propFileName);
 
			if (inputStream != null) {
				prop.load(inputStream);
			} else {
				throw new FileNotFoundException("property file '" + propFileName + "' not found in the classpath");
			}

			OAuth2PlatformClient client = factory.getOAuth2PlatformClient();
 
			inputStream.close();

			BearerTokenResponse bTokenResponse = client.retrieveBearerTokens(prop.getProperty(authCode), factory.getPropertyValue("OAuth2AppRedirectUri"));
			prop.setProperty(accessToken, bTokenResponse.getAccessToken());
			prop.setProperty(refreshToken, bTokenResponse.getRefreshToken());


		} catch (Exception e) {
			LOG.error("Error during loadProperties", e.getCause());
		} 
	}
}
