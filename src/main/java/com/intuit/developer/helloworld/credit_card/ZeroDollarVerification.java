package com.intuit.developer.helloworld.credit_card;

// import java.io.Serializable;

// card verification information storage
public final class ZeroDollarVerification {

    private String transactionId;
    private String type;
    private String status;

    private ZeroDollarVerification() {}

    public String getTransactionId() {
        return this.transactionId;
    }

    public void setTransactionId(String value) {
        this.transactionId = value;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String value) {
        this.type = value;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String value) {
        this.status = value;
    }
    
}
