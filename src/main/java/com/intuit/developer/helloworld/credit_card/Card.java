package com.intuit.developer.helloworld.credit_card;

import java.io.Serializable;

enum CardType {
    VISA,
    MC,
    AMEX,
    DISC,
    DINERS,
    JCB
}

public class Card implements Serializable {
  
    private String id;
    private String number;
    private String expMonth;
    private String expYear;
    private String cvc;
    private String name;
    private Address address;
    private String commercialCardCode;
    private CardPresent cardPresent;
    private String created;
    private String updated;
    private String entityVersion;
    private CvcVerification cvcVerification;
    private CardType cardType;
    private String entityType;
    private String entityId;
    private String numberSHA512;
    private String status;
    private ZeroDollarVerification zeroDollarVerification;
    private Boolean def;
    private Boolean isBusiness;
    private Boolean isLevel3Eligible;

    public CvcVerification getCvcVerification() {
        return this.cvcVerification;
    }

    public void setCvcVerification(CvcVerification value) {
        this.cvcVerification = value;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String value) {
        this.status = value;
    }

    public String getNumberSHA512() {
        return this.numberSHA512;
    }

    public void setNumberSHA512(String value) {
        this.numberSHA512 = value;
    }

    public String getEntityVersion() {
        return this.entityVersion;
    }

    public void setEntityVersion(String value) {
        this.entityVersion = value;
    }
            
    public Boolean getIsBusiness() {
        return this.isBusiness;
    }

    public void setIsBusiness(Boolean value) {
        this.isBusiness = value;
    }
        
    public Boolean getIsLevel3Eligible() {
        return this.isLevel3Eligible;
    }

    public void setIsLevel3Eligible(Boolean value) {
        this.isLevel3Eligible = value;
    }

    public Boolean getDefault() {
        return this.def;
    }

    public void setDefault(Boolean value) {
        this.def = value;
    }
            
    public ZeroDollarVerification getZeroDollarVerification() {
        return this.zeroDollarVerification;
    }

    public void setZeroDollarVerification(ZeroDollarVerification value) {
        this.zeroDollarVerification = value;
    }
            
    public String getEntityType() {
        return this.entityType;
    }

    public void setEntityType(String value) {
        this.entityType = value;
    }
        
    public String getEntityId() {
        return this.entityId;
    }

    public void setEntityId(String value) {
        this.entityId = value;
    }

    public CardType getCardType() {
        return this.cardType;
    }

    public void setCardType(CardType value) {
        this.cardType = value;
    }

    public String getUpdated() {
        return this.updated;
    }

    public void setUpdated(String value) {
        this.updated = value;
    }
            
    public String getCreated() {
        return this.created;
    }

    public void setCreated(String value) {
        this.created = value;
    }

    /**
     * System generated alpha-numeric id
     *
     * @return System generated alpha-numeric id
     */
    public String getId() {
        return id;
    }

    /**
     * System generated alpha-numeric id
     *
     * @param id System generated alpha-numeric id
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * Credit/debit card number
     *
     * @return Credit/debit card number
     */
    public String getNumber() {
        return number;
    }

    /**
     * Credit/debit card number
     *
     * @param number Credit/debit card number
     */
    public void setNumber(String number) {
        this.number = number;
    }

    /**
     * Two digits indicating card's expiration month
     *
     * @return Two digits indicating card's expiration month
     */
    public String getExpMonth() {
        return expMonth;
    }

    /**
     * Two digits indicating card's expiration month
     *
     * @param expMonth Two digits indicating card's expiration month
     */
    public void setExpMonth(String expMonth) {
        this.expMonth = expMonth;
    }

    /**
     * Four digits indicating card's expiration year
     *
     * @return Four digits indicating card's expiration year
     */
    public String getExpYear() {
        return expYear;
    }

    /**
     * Four digits indicating card's expiration year
     *
     * @param expYear Four digits indicating card's expiration year
     */
    public void setExpYear(String expYear) {
        this.expYear = expYear;
    }

    /**
     * CVC code - Strongly recommended for screening fraudulent transactions
     *
     * @return CVC code - Strongly recommended for screening fraudulent transactions
     */
    public String getCvc() {
        return cvc;
    }

    /**
     * CVC code - Strongly recommended for screening fraudulent transactions
     *
     * @param cvc CVC code - Strongly recommended for screening fraudulent transactions
     */
    public void setCvc(String cvc) {
        this.cvc = cvc;
    }

    /**
     * Cardholder's name as it appears on the card
     *
     * @return Cardholder's name as it appears on the card
     */
    public String getName() {
        return name;
    }

    /**
     * Cardholder's name as it appears on the card
     *
     * @param name Cardholder's name as it appears on the card
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Address
     *
     * @return Address
     */
    public Address getAddress() {
        return address;
    }

    /**
     * Address
     *
     * @param address Address
     */
    public void setAddress(Address address) {
        this.address = address;
    }

    /**
     * Specific code that is applicable when the card used is  a commercial card (corporate cards)
     *
     * @return Specific code that is applicable when the card used is  a commercial card (corporate cards)
     */
    public String getCommercialCardCode() {
        return commercialCardCode;
    }

    /**
     * Specific code that is applicable when the card used is  a commercial card (corporate cards)
     *
     * @param commercialCardCode Specific code that is applicable when the card used is  a commercial card (corporate cards)
     */
    public void setCommercialCardCode(String commercialCardCode) {
        this.commercialCardCode = commercialCardCode;
    }

    /**
     * Applies when the card is swiped using a card reader. Commonly used at a point of sale location
     *
     * @return Applies when the card is swiped using a card reader. Commonly used at a point of sale location
     */
    public CardPresent getCardPresent() {
        return cardPresent;
    }

    /**
     * Applies when the card is swiped using a card reader. Commonly used at a point of sale location
     *
     * @param cardPresent Applies when the card is swiped using a card reader. Commonly used at a point of sale location
     */
    public void setCardPresent(CardPresent cardPresent) {
        this.cardPresent = cardPresent;
    }

}

