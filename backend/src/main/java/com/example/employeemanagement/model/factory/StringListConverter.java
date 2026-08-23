package com.example.employeemanagement.model.factory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter
public class StringListConverter implements AttributeConverter<List<String>, String> {

  @Override
  public String convertToDatabaseColumn(List<String> values) {
    if (values == null || values.isEmpty()) {
      return "";
    }
    return values.stream().map(value -> value == null ? "" : value).collect(Collectors.joining(","));
  }

  @Override
  public List<String> convertToEntityAttribute(String value) {
    if (value == null || value.isBlank()) {
      return new ArrayList<>();
    }
    return Arrays.stream(value.split(",")).map(String::trim).filter(item -> !item.isEmpty()).collect(Collectors.toList());
  }
}
