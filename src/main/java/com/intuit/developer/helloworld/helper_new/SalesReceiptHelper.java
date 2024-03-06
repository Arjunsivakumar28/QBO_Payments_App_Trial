package com.intuit.developer.helloworld.helper_new;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.RandomStringUtils;

import com.intuit.ipp.data.Account;
import com.intuit.ipp.data.Customer;
import com.intuit.ipp.data.Item;
import com.intuit.ipp.data.Line;
import com.intuit.ipp.data.LineDetailTypeEnum;
import com.intuit.ipp.data.SalesItemLineDetail;
import com.intuit.ipp.data.SalesReceipt;
import com.intuit.ipp.data.TaxCode;
import com.intuit.ipp.exception.FMSException;
import com.intuit.ipp.services.DataService;
import com.intuit.ipp.util.DateUtils;

/**
 * @author dderose
 *
 */
public final class SalesReceiptHelper {

	private SalesReceiptHelper() {
		
	}

	public static SalesReceipt getSalesReceiptFields(DataService service) throws FMSException, ParseException {
		SalesReceipt salesReceipt = new SalesReceipt();
		salesReceipt.setDocNumber(RandomStringUtils.randomNumeric(4));
		try {
			salesReceipt.setTxnDate(DateUtils.getCurrentDateTime());
		} catch (ParseException e) {
			throw new FMSException("ParseException while getting current date.");
		}

		
		salesReceipt.setApplyTaxAfterDiscount(false);
		return salesReceipt;
	}

}
