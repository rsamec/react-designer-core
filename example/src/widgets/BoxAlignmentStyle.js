import React, { Component } from 'react'

export default function (props) {
  
  const { justifyItems, justifyContent, alignItems, alignContent, alignSelf, justifySelf } = props;
  
  return {
    justifyItems: justifyItems,
    justifyContent: justifyContent,
    alignItems: alignItems,
    alignContent: alignContent,
    alignSelf: alignSelf,
    justifySelf: justifySelf
  }
}