package com.example.employeemanagement.model.factory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter
public class LongListConverter implements AttributeConverter<List<Long>, String> {

  @Override
  public String convertToDatabaseColumn(List<Long> values) {
    if (values == null || values.isEmpty()) {
      return "";
    }
    return values.stream().map(String::valueOf).collect(Collectors.joining(","));
  }

  @Override
  public List<Long> convertToEntityAttribute(String value) {
    if (value == null || value.isBlank()) {
      return new ArrayList<>();
    }
    return Arrays.stream(value.split(","))
        .map(String::trim)
        .filter(item -> !item.isEmpty())
        .map(Long::valueOf)
        .collect(Collectors.toList());
  }
}
