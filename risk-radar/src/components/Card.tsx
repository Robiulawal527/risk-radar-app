import React from 'react'; import {View,StyleSheet,ViewProps} from 'react-native'; import {colors,shadow} from '../theme';
export function Card({style,...props}:ViewProps){return <View style={[styles.card,shadow,style]} {...props}/>}
const styles=StyleSheet.create({card:{backgroundColor:colors.card,borderColor:colors.border,borderWidth:1,borderRadius:22,padding:16}});
