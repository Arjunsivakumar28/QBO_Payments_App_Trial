package com.intuit.developer.helloworld.qbo_new;

import com.intuit.ipp.exception.FMSException;
import com.intuit.ipp.services.ReportService;

/**
 * 
 * @author dderose
 *
 */

public class ReportServiceFactory {

	
	/**
	 * Initializes ReportService for a given app/company profile
	 * 
	 * @return
	 * @throws FMSException
	 */
	public static ReportService getReportService() throws FMSException {
		//create reportservice
		return new ReportService(ContextFactory.getContext());
	}
}
