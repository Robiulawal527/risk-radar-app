import React from 'react'; import {Text,StyleSheet} from 'react-native'; import {colors} from '../theme';
export function RiskBadge({level}:{level:string}){const c=level?.includes('High')?colors.red:level?.includes('Medium')?colors.orange:colors.green;return <Text style={[styles.badge,{color:c,backgroundColor:c+'22'}]}>{level}</Text>}
const styles=StyleSheet.create({badge:{paddingHorizontal:12,paddingVertical:7,borderRadius:10,fontWeight:'900',overflow:'hidden'}});
