package com.intuit.developer.helloworld.qbo_new;

import com.intuit.ipp.exception.FMSException;
import com.intuit.ipp.services.DataService;

/**
 * 
 * @author dderose
 *
 */

public class DataServiceFactory {

	
	/**
	 * Initializes DataService for a given app/company profile
	 * 
	 * @return
	 * @throws FMSException
	 */
	public static DataService getDataService() throws FMSException {
		//create dataservice
		return new DataService(ContextFactory.getContext());
	}
}
