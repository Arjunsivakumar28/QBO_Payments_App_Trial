package com.intuit.developer.helloworld.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

import java.io.File;
import java.io.FileWriter;
import java.io.FileNotFoundException;
import java.io.IOException;

import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.apache.tools.ant.taskdefs.condition.Http;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.view.RedirectView;

import com.intuit.developer.helloworld.client.OAuth2PlatformClientFactory;
import com.intuit.oauth2.client.OAuth2PlatformClient;
import com.intuit.oauth2.config.OAuth2Config;
import com.intuit.oauth2.config.Scope;
import com.intuit.oauth2.exception.InvalidRequestException;

import com.intuit.oauth2.data.BearerTokenResponse;
import com.intuit.oauth2.exception.OAuthException;
import com.intuit.ipp.exception.FMSException;

/**
 * @author dderose
 *
 */
@Controller
public class HomeController {
	
	private static final Logger logger = Logger.getLogger(HomeController.class);
	
	@Autowired
	OAuth2PlatformClientFactory factory;
	    
	@RequestMapping("/")
	public String home() {
		return "home";
	}

	@RequestMapping("/dashboard")
	public String dashboard() {
		return "dashboard";
	}
	
	@RequestMapping("/connected")
	public String connected() {
		return "connected";
	}

	@RequestMapping("/payment")
	public String payment() {
		return "payment";
	}

	@RequestMapping("/reach")
	public String reach() {
		return "reach";
	}

	@RequestMapping("/checkout")
	public String checkout() {
		return "checkout";
	}

	@RequestMapping("/login")
	public View login(HttpSession session) {
		logger.info("inside modal login connection");

		String realmId = factory.getPropertyValue("OAuth2AppSandboxRealmId");
		session.setAttribute("realmId", realmId);
		OAuth2PlatformClient client = factory.getOAuth2PlatformClient();
		
		try {

			String refreshToken = "";

			logger.info("inside modal login connection in the try block");

			File file = new File("code.txt");
			Scanner readFile = new Scanner(file);
			while (readFile.hasNextLine()) {
				logger.info("inside modal login connection reading refresh token file");
				String data = readFile.nextLine();
				refreshToken = data;
			}
			readFile.close();

			logger.info("inside modal login connection refresh token value : " + refreshToken);

			// String newRefreshTokentest = "abc";

			// FileWriter fileWriterTest = new FileWriter("code.txt");
            // fileWriterTest.write(newRefreshTokentest);
            // fileWriterTest.close();

			BearerTokenResponse bTokenResponse = client.refreshToken(refreshToken);

			logger.info("inside modal login connection bearer token new refresh token generated");

			session.setAttribute("refresh_token", bTokenResponse.getRefreshToken());
			session.setAttribute("access_token", bTokenResponse.getAccessToken());

			String newRefreshToken = bTokenResponse.getRefreshToken();

			FileWriter fileWriter = new FileWriter("code.txt");
            fileWriter.write(newRefreshToken);
            fileWriter.close();

			logger.info("inside modal login connection NEW!!!!! refresh token value : " + refreshToken);

			return new RedirectView("/dashboard", false, true, false);

		} catch (OAuthException e) {
			logger.error("Error while calling bearer token :: " + e.getMessage());
			return new RedirectView("/error", false, true, false);
		} catch (FileNotFoundException e) {
			logger.error("the file could not be found : " + e.getMessage());
			return new RedirectView("/error", false, true, false);
		} catch (IOException e) {
            logger.error("writing to file failed : " + e.getMessage());
			return new RedirectView("/error", false, true, false);
        }
	}
	
	/**
	 * Controller mapping for connectToQuickbooks button
	 * @return
	 */
	@RequestMapping("/connectToQuickbooks")
	public View connectToQuickbooks(HttpSession session) {
		logger.info("inside connectToQuickbooks ");
		OAuth2Config oauth2Config = factory.getOAuth2Config();
		
		String redirectUri = factory.getPropertyValue("OAuth2AppRedirectUri"); 
		
		String csrf = oauth2Config.generateCSRFToken();
		session.setAttribute("csrfToken", csrf);
		try {
			List<Scope> scopes = new ArrayList<Scope>();
			scopes.add(Scope.AccountingPayments);
			return new RedirectView(oauth2Config.prepareUrl(scopes, redirectUri, csrf), true, true, false);
		} catch (InvalidRequestException e) {
			logger.error("Exception calling connectToQuickbooks ", e);
		}
		return null;
	}

}
