package com.playground;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import android.content.Context;
import android.content.res.AssetManager;

import org.tensorflow.lite.task.core.BaseOptions;
import org.tensorflow.lite.task.text.qa.QaAnswer;
import org.tensorflow.lite.task.text.qa.BertQuestionAnswerer;

import java.io.IOException;
import java.util.List;

public class BertQuestionAnswererModule extends ReactContextBaseJavaModule {

    ReactApplicationContext reactContext;

    public BertQuestionAnswererModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    String modelFile = "bertQA.tflite";

    @Override
    public String getName() {
        return "BertQuestionAnswerer";
    }

    @ReactMethod
    public void getAnswer(String context, String question, Promise promise) {
        try {
            AssetManager assetManager = reactContext.getAssets();

            // Initialization
            BertQuestionAnswerer.BertQuestionAnswererOptions options = BertQuestionAnswerer.BertQuestionAnswererOptions.builder()
                    .setBaseOptions(BaseOptions.builder().setNumThreads(4).build())
                    .build();

            BertQuestionAnswerer answerer = BertQuestionAnswerer.createFromFileAndOptions(reactContext, modelFile, options);

            // Run inference
            List<QaAnswer> answers = answerer.answer(context, question);

            WritableArray answersArray = Arguments.createArray();
            for (QaAnswer answer : answers) {
                WritableMap answerMap = convertToWritableMap(answer);
                answersArray.pushMap(answerMap);
            }

            promise.resolve(answersArray);

        } catch (IOException e) {
            // TODO Handle the exception
            promise.reject("Failed to Load Model", e);
        }
    }

    private WritableMap convertToWritableMap(QaAnswer answer) {
        WritableMap answerMap = Arguments.createMap();

        answerMap.putString("text", answer.text); // Text => gives the probable answer
        return answerMap;
    }
}

