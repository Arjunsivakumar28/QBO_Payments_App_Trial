package com.intuit.developer.helloworld.payment;

import java.text.ParseException;
import java.util.List;

import org.apache.commons.lang.RandomStringUtils;

import com.intuit.developer.helloworld.helper_new.PaymentHelper;
import com.intuit.developer.helloworld.qbo_new.DataServiceFactory;
import com.intuit.ipp.data.Error;
import com.intuit.ipp.data.Payment;
import com.intuit.ipp.exception.FMSException;
import com.intuit.ipp.services.DataService;
import com.intuit.ipp.util.Logger;

/**
 * Demonstrates methods to update Payment
 * 1. Sparse update with limited fields
 * 2. Full update with all fields
 * 
 * @author dderose
 *
 */
public class PaymentUpdate {

	private static final org.slf4j.Logger LOG = Logger.getLogger();
	
	public static void main(String[] args) {
		try {
			updatePayment();
		} catch (Exception e) {
			LOG.error("Error during CRUD", e.getCause());
		}
	}
	
	public static void updatePayment() throws FMSException, ParseException {
		
		try {
			
			DataService service = DataServiceFactory.getDataService();
			
			// create Payment
			Payment payment = PaymentHelper.getPaymentFields(service);
			Payment addPayment = service.add(payment);
			LOG.info("Payment added : " + addPayment.getId() + " tot amt ::: " + addPayment.getTotalAmt());
			
			// sparse update Payment 
			addPayment.setSparse(true);
			// addPayment.setDocNumber(RandomStringUtils.randomAlphanumeric(5));
			// Payment savedPayment = service.update(addPayment);
			// LOG.info("Payment sparse updated: " + savedPayment.getId() + " doc num ::: " + savedPayment.getDocNumber() );
			
			// update Payment with all fields
			// addPayment = service.findById(savedPayment);
			// Payment updatedPayment = PaymentHelper.getPaymentFields(service);
			// updatedPayment.setId(addPayment.getId());
			// updatedPayment.setSyncToken(addPayment.getSyncToken());
		    // savedPayment = service.update(updatedPayment);
		    // LOG.info("Payment updated with all fields : " + savedPayment.getId() + " doc num ::: " + savedPayment.getDocNumber());
			
		} catch (FMSException e) {
			List<Error> list = e.getErrorList();
			list.forEach(error -> LOG.error("Error while calling entity update:: " + error.getMessage()));
		}
		
	}

}
