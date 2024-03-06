package com.intuit.developer.helloworld.tokenization;

import java.io.Serializable;

public class Token implements Serializable {
    
    private String value;

    public String getValue() {
        return this.value;
    }

    public void setValue(String value) {
        this.value = value;
    }

}
