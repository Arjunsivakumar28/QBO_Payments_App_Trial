package com.intuit.developer.helloworld.BankAccount;
import java.io.Serializable;

enum BankAccountTypeEnum {
        PERSONAL_CHECKING,
        PERSONAL_SAVINGS,
        BUSINESS_CHECKING,
        BUSINESS_SAVINGS
}

enum BankAccountInputTypeEnum {
    KEYED,
    SCANNED
}


public class BankAccount implements Serializable {

    private String id;
    private String name;   
    private String accountNumber;   
    private String phone;   
    private BankAccountTypeEnum accountType;
    private String routingNumber;
    private String created;
    private String updated;
    private String entityVersion;
    private String country;
    private BankAccountInputTypeEnum inputType;
    private String entityId;
    private String entityType;
    private String accountNumberSHA512;
    private String verificationStatus;
    private String bankName;
    private Boolean defaultStatus;
    
    // public BankAccount(String name, String accountNumber, String phone, String accountType, String routingNumber) {
    //     this.name = name;
    //     this.accountNumber = accountNumber;
    //     this.phone = phone;
    //     this.accountType = accountType;
    //     this.routingNumber = routingNumber;
    // }

    public String getId() {
        return this.id;
    }

    public void setId(String value) {
        this.id = value;
    }
        
    public String getName() {
        return this.name;
    }

    public void setName(String value) {
        this.name = value;
    }

    public String getAccountNumber() {
        return this.accountNumber;
    }

    public void setAccountNumber(String value) {
        this.accountNumber = value;
    }

    public String getPhone() {
        return this.phone;
    }

    public void setPhone(String value) {
        this.phone = value;
    }

    public BankAccountTypeEnum getAccountType() {
        return this.accountType;
    }

    public void setAccountType(BankAccountTypeEnum value) {
        this.accountType = value;
    }

    public String getRoutingNumber() {
        return this.routingNumber;
    }

    public void setRoutingNumber(String value) {
        this.routingNumber = value;
    }

    public String getCreated() {
        return this.created;
    }

    public void setCreated(String value) {
        this.created = value;
    }

    public String getUpdated() {
        return this.updated;
    }

    public void setUpdated(String value) {
        this.updated = value;
    }

    public String getEntityVersion() {
        return this.entityVersion;
    }

    public void setEntityVersion(String value) {
        this.entityVersion = value;
    }

    public String getCountry() {
        return this.country;
    }
    
    public void setCountry(String value) {
        this.country = value;
    }

    public BankAccountInputTypeEnum getInputType() {
        return this.inputType;
    }

    public void setInputType(BankAccountInputTypeEnum value) {
        this.inputType = value;
    }

    public String getEntityId() {
        return this.entityId;
    }

    public void setEntityId(String value) {
        this.entityId = value;
    }

    public String getEntityType() {
        return this.entityType;
    }
    
    public void setEntityType(String value) {
        this.entityType = value;
    }

    public String getAccountNumberSHA512() {
        return this.accountNumberSHA512;
    }

    public void setAccountNumberSHA512(String value) {
        this.accountNumberSHA512 = value;
    }

    public String getVerificationStatus() {
        return this.verificationStatus;
    }

    public void setVerificationStatus(String value) {
        this.verificationStatus = value;
    }

    public String getBankName() {
        return this.bankName;
    }

    public void setBankName(String value) {
        this.bankName = value;
    }

    public Boolean getDefault() {
        return this.defaultStatus;
    }

    public void setDefault(Boolean value) {
        this.defaultStatus = value;
    }
    
}
