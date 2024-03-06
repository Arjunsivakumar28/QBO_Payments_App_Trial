package com.intuit.developer.helloworld.BankAccount;

import java.util.UUID;

import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

import com.intuit.developer.helloworld.helper_old.QBOServiceHelper;
import com.intuit.developer.helloworld.client.OAuth2PlatformClientFactory;

import com.intuit.ipp.exception.FMSException;
import com.intuit.ipp.util.Logger;

/*
 * Query bank accounts object from payments API
 */
@Controller()
public class BankAccountCRUD {

    @Autowired
    QBOServiceHelper helper;

    @Autowired
    OAuth2PlatformClientFactory factory;

    private static final org.slf4j.Logger LOG = Logger.getLogger();

    @ResponseBody
    @RequestMapping("/bankAccountGet")
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

        ResponseEntity<String> res = restTemplate.exchange(url, HttpMethod.GET, requestEntity, String.class, param);

        String response = res.getBody();

        // -------------------------------------------------------------------------------

        return response;

    }

}
