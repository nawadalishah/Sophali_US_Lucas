// import { FlatList, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { useNavigation } from '@react-navigation/native';

// import { Button, Header, InputField } from '../../components';
// import { AndroidSafeArea, COLORS, FONTS, SIZES } from '../../constants';
// import { CopySvg, PayPalSvg, PlusTwoSvg } from '../../svg';
// import { FormControl } from 'native-base';
// import { Shadow } from 'react-native-shadow-2';
// import * as yup from "yup";
// import { useAppDispatch, useAppSelector } from '../../redux/Store';
// import Modal from "react-native-modal";

// export default function AddToken() {
//   const [optionPickModal, setOptionPickModal] = useState(false);
//   const { user } = useAppSelector(state => state.auth)
//   const schema = yup.object().shape({
//     amount_usd: yup.string().required("Token is required"),
//   });
//   const userData: any = user;

//   const { merchantTokens } = useAppSelector(state => state.merchantToken);
//   const isTokenLoaded = useAppSelector(state => state.merchantToken.isTokenLoading)
//   const dispatch = useAppDispatch();
//   const navigation = useNavigation();
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [tokens, setTotalTokens] = useState<any>(0);

//   const [form, setForm] = useState({
//     amount_usd: 0,
//     name_on_card: "",
//     DCard_Number: "",
//     Card_Expiry_Date: "",
//     CVV: "",
//     zip_code: "",
//     user_id: userData?.userDetail?.id
//   })

//   useEffect(() => {
//     dispatch(getUserTokens({ user_id: userData?.userDetail?.id }))
//   }, [])

//   useEffect (() => {
//     let tokenData:number = 0;
//     if(userTokens && userTokens.tokens) {
//       userTokens?.tokens.map((item:number,index:number) => {
//         tokenData = Number(calculateBalance(index));
//       })
//       setTotalTokens(tokenData);
//     }
//   }, [userTokens])

//   let lastTokenBalance: number = 0;

//   function addToken() {

//     schema
//       .validate(form)
//       .then(() => {
//         if (form.amount_usd != 0) {
//           const data = {
//             amount_usd: form.amount_usd,
//             helcium_transation_id: 1679439960281,
//             sophali_token_balance: 60,
//             sophali_tokens: form.amount_usd ,
//             status: "active",
//             user_id: userData?.userDetail?.id
//           }

//           dispatch(addTokenAction(data)).then((res) => {
//             if(res.payload) {
//               dispatch(getUserTokens({ user_id: userData?.userDetail?.id }))
//             }
//           }).catch((err) => console.log(err));
//           setOptionPickModal(false)

//           setForm({
//             amount_usd: 0,
//             name_on_card: "",
//             DCard_Number: "",
//             Card_Expiry_Date: "",
//             CVV: "",
//             zip_code: "",
//             user_id: userData?.userDetail?.id
//           })
//         }
//       })
//       .catch((err: yup.ValidationError) => {
//         if (!err.path) return;
//         setErrors({ [err.path]: err.message });
//       });
//   }
//   function renderHeader() {
//     return <Header title="Tokens" onPress={() => navigation.goBack()} />;
//   }

//   function calculateBalance(index: number) {
//     if (userTokens?.tokens[index]?.type && userTokens?.tokens[index]?.tokens) {
//       if (userTokens?.tokens[index].type == 'consumed') {
//         if (index == 1 && userTokens?.tokens[index - 1].tokens) {
//           lastTokenBalance = userTokens?.tokens[index - 1].tokens - userTokens?.tokens[index].tokens;
//           return lastTokenBalance;
//         }
//         lastTokenBalance = lastTokenBalance - userTokens?.tokens[index].tokens;
//         return lastTokenBalance;
//       }

//       if (userTokens?.tokens[index].type == 'earned') {
//         if (index == 1 && userTokens?.tokens[index - 1].tokens) {
//           lastTokenBalance = userTokens?.tokens[index - 1].tokens + userTokens?.tokens[index].tokens;
//           return lastTokenBalance;
//         }
//         lastTokenBalance = lastTokenBalance + userTokens?.tokens[index].tokens;
//         // totalTokens = totalTokens + lastTokenBalance;

//         return lastTokenBalance;
//       }
//     }
//     // return index
//   }

//   function renderContent() {
//     return (
//       <ScrollView
//         contentContainerStyle={{
//           flexGrow: 1,
//           paddingHorizontal: 16,
//           paddingTop: 16,
//           paddingBottom: 30,
//         }}
//         showsVerticalScrollIndicator={false}>
//               <View
//           style={{
//             flexDirection:'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             marginTop: 12,
//             // marginLeft: 160,
//           }}>
//               <Text
//             style={{
//               ...FONTS.H4,
//               lineHeight: 24 * 1.2,
//               textTransform: "capitalize",
//             }}
//           >
//             Total Tokens {tokens && isTokenLoaded == false ? tokens : 0}
//           </Text>

//           <TouchableOpacity
//             style={{
//               backgroundColor:
//                 COLORS.green,
//               borderRadius: 50,
//               // marginHorizontal: 5,
//             }}
//             onPress={() => setOptionPickModal(true)}>
//             <Text
//               style={{
//                 paddingHorizontal: 36,
//                 paddingVertical: 6,
//                 lineHeight: 14 * 1.5,
//                 color: COLORS.white,
//                 fontFamily: 'Lato-Regular',
//                 fontSize: 14,
//               }}>
//               TopUp
//             </Text>
//           </TouchableOpacity>

//         </View>
//         <View
//           style={{
//             paddingHorizontal: 16,
//             flexDirection: "row",
//             alignItems: "center",
//             justifyContent: "space-between",
//             marginTop: 24,
//             marginBottom: 4,
//           }}
//         >

//           <Text
//             style={{
//               ...FONTS.H4,
//               lineHeight: 24 * 1.2,
//               textTransform: "capitalize",
//             }}
//           >
//             Credit cards
//           </Text>
//           <TouchableOpacity
//             onPress={() => navigation.navigate("AddNewCard" as never)}
//           >

//           </TouchableOpacity>
//         </View>
//         <View>
//           <FlatList
//             horizontal={true}
//             data={MyTokenCard}
//             contentContainerStyle={{
//               paddingLeft: 16,
//               marginBottom: 20,
//             }}
//             showsHorizontalScrollIndicator={false}
//             renderItem={({ item, index }) => {
//               return (
//                 <View>
//                   <Image
//                     source={item.background}
//                     style={{
//                       width: 323,
//                       height: 197,
//                       marginRight: 10,
//                       borderRadius: 10,
//                     }}
//                   />
//                 </View>
//               );
//             }}
//           />
//         </View>
//         <View
//           style={{
//             paddingHorizontal: 28,
//             marginTop: 40,
//             flexDirection: 'row',
//             flexWrap: 'wrap',
//             justifyContent: 'space-between',
//             top: -10,
//           }}>
//           {userTokens && userTokens?.tokens && userTokens?.tokens.length && isTokenLoaded == false ? userTokens?.tokens.map((item: any, index: any) => {
//             return (
//               <Shadow
//                 key={item.id + Math.random()}
//                 offset={[0, 0]}
//                 distance={15}
//                 startColor={'rgba(6, 38, 100, 0.03)'}
//                 // @ts-ignore
//                 finalColor={'rgba(6, 38, 100, 0.0)'}>
//                 <TouchableOpacity

//                 >
//                   <View
//                     style={{
//                       width: 323,
//                       height: 126,
//                       backgroundColor: COLORS.white,
//                       marginBottom: 8,
//                       borderRadius: 20,
//                       padding: 4,
//                       paddingBottom: 15,
//                     }}>
//                     <View
//                       style={{
//                         flex: 1,
//                         marginHorizontal: 12,
//                         flexDirection: 'row',
//                         justifyContent: 'center'
//                       }}>
//                       <Text
//                         style={{
//                           ...FONTS.Lato_700Bold,
//                           fontSize: 14,
//                           lineHeight: 14 * 1.3,
//                           flex: 1,
//                           color: COLORS.black,
//                           marginTop: 5
//                         }}
//                         numberOfLines={1}>
//                         {item.createdAt}
//                       </Text>

//                     </View>
//                     <View
//                       style={{
//                         flex: 1,
//                         marginHorizontal: 12,
//                         flexDirection: 'row'
//                       }}>
//                       <Text
//                         style={{
//                           ...FONTS.Lato_700Bold,
//                           fontSize: 14,
//                           lineHeight: 14 * 1.3,
//                           flex: 1,
//                           color: COLORS.black,
//                           marginTop: 5
//                         }}
//                         numberOfLines={1}>
//                         Top Up Id
//                       </Text>
//                       <Text
//                         style={{
//                           color: COLORS.gray,
//                           ...FONTS.Lato_400Regular,
//                           fontSize: 12,
//                           marginTop: 5
//                         }}>
//                         {item.id}Consumed
//                       </Text>

//                     </View>
//                     <View
//                       style={{
//                         flex: 1,
//                         marginHorizontal: 12,
//                         flexDirection: 'row'
//                       }}>
//                       <Text
//                         style={{
//                           ...FONTS.Lato_700Bold,
//                           fontSize: 14,
//                           lineHeight: 14 * 1.3,
//                           flex: 1,
//                           color: COLORS.black,
//                           marginTop: 5
//                         }}
//                         numberOfLines={1}>
//                         Earn Token
//                       </Text>
//                       <Text
//                         style={{
//                           color: COLORS.gray,
//                           ...FONTS.Lato_400Regular,
//                           fontSize: 12,
//                           marginTop: 5
//                         }}>
//                         {item.type == 'earned' ? item.tokens : 0}
//                       </Text>

//                     </View>

//                     <View
//                       style={{
//                         flex: 1,
//                         marginHorizontal: 12,
//                         flexDirection: 'row'
//                       }}>
//                       <Text
//                         style={{
//                           ...FONTS.Lato_700Bold,
//                           fontSize: 14,
//                           lineHeight: 14 * 1.3,
//                           flex: 1,
//                           color: COLORS.black,
//                           marginTop: 5
//                         }}
//                         numberOfLines={1}>
//                         Used Token
//                       </Text>
//                       <Text
//                         style={{
//                           color: COLORS.gray,
//                           ...FONTS.Lato_400Regular,
//                           fontSize: 12,
//                           marginTop: 5
//                         }}>
//                         {item.type == 'consumed' ? item.tokens : 0}
//                       </Text>

//                     </View>

//                     <View
//                       style={{
//                         flex: 1,
//                         marginHorizontal: 12,
//                         flexDirection: 'row'
//                       }}>
//                       <Text
//                         style={{
//                           ...FONTS.Lato_700Bold,
//                           fontSize: 14,
//                           lineHeight: 14 * 1.3,
//                           flex: 1,
//                           color: COLORS.black,
//                           marginTop: 5
//                         }}
//                         numberOfLines={1}>
//                         Token Balance
//                       </Text>
//                       <Text
//                         style={{
//                           color: COLORS.gray,
//                           ...FONTS.Lato_400Regular,
//                           fontSize: 12,
//                           marginTop: 5
//                         }}>
//                         {
//                           index > 0 ?
//                             calculateBalance(index)
//                             :
//                             item.tokens
//                         }
//                       </Text>

//                     </View>
//                   </View>

//                 </TouchableOpacity>
//               </Shadow>
//             );
//           }) :

//             <Text
//               style={{
//                 ...FONTS.H2,
//                 textTransform: "capitalize",
//                 marginBottom: 10,
//               }}
//             >
//               No Tokens Found

//             </Text>

//           }
//         </View>
//         <View
//           style={{
//             justifyContent: 'center',
//             alignItems: 'center',
//             marginBottom: 5,
//             marginTop: 12,
//             marginLeft: 22,
//             marginRight: 22
//           }}>

//           <TouchableOpacity
//             style={{
//               backgroundColor:
//                 COLORS.green,
//               borderRadius: 50,
//               // marginHorizontal: 5,
//             }}
//             onPress={() => setOptionPickModal(true)}>
//             {/* <Text
//               style={{
//                 paddingHorizontal: 36,
//                 paddingVertical: 6,
//                 lineHeight: 14 * 1.5,
//                 color: COLORS.white,
//                 fontFamily: 'Lato-Regular',
//                 fontSize: 14,
//               }}>
//               Add Token
//             </Text> */}
//           </TouchableOpacity>

//         </View>

//       </ScrollView>
//     );
//   }
//   function renderOptionModal() {
//     return (
//       <ScrollView
//       contentContainerStyle={{
//         flexGrow: 2,
//         paddingHorizontal: 16,
//         paddingTop: 16,
//         paddingBottom: 30,
//       }}
//       showsVerticalScrollIndicator={true}>

//         <Modal
//           isVisible={optionPickModal}
//           onBackdropPress={() => setOptionPickModal(false)}
//           hideModalContentWhileAnimating={true}
//           backdropTransitionOutTiming={0}
//           style={{ margin: 0 }}
//         >
//           <View
//             style={{
//               backgroundColor: COLORS.lightBlue,
//               borderTopLeftRadius: 20,
//               borderTopRightRadius: 20,
//               position: "absolute",
//               width: SIZES.width,
//               bottom: 0,
//               paddingHorizontal: 12,
//               paddingVertical: 30,
//             }}
//           >
//             <Text
//               style={{
//                 ...FONTS.H2,
//                 textTransform: "capitalize",
//                 marginBottom: 10,
//               }}
//             >
//               Topup your tokens

//             </Text>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 width: '100%',
//                 height: 60,
//                 backgroundColor: COLORS.white,
//               }}
//             >
//               <FormControl ml={5} mt={5} mb={5}  isInvalid={!!errors.token}>
//                 <InputField
//                   title="Amount in USD"

//                   placeholderColor={COLORS.gray}
//                   // secureTextEntry={true}
//                   onchange={(v: number) => {
//                     setForm({ ...form, amount_usd: v })
//                   }}

//                 />
//                 <FormControl.ErrorMessage>{errors.token}</FormControl.ErrorMessage>
//               </FormControl>

//             </View>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 width: '100%',
//                 height: 60,
//                 backgroundColor: COLORS.white,
//               }}
//             >
//               <FormControl ml={5} mt={5} mb={5}  isInvalid={!!errors.token}>
//                 <InputField
//                   title="Name on Card"

//                   placeholderColor={COLORS.gray}
//                   // secureTextEntry={true}
//                   onchange={(v: string) => {
//                     setForm({ ...form, name_on_card: v })
//                   }}

//                 />
//                 <FormControl.ErrorMessage>{errors.token}</FormControl.ErrorMessage>
//               </FormControl>

//             </View>

//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 width: '100%',
//                 height: 60,
//                 backgroundColor: COLORS.white,
//               }}
//             >
//               <FormControl ml={5} mt={10} mb={10} isInvalid={!!errors.token}>
//                 <InputField
//                   title="DCard Number"

//                   placeholderColor={COLORS.gray}
//                   // secureTextEntry={true}
//                   onchange={(v: string) => {
//                     setForm({ ...form, DCard_Number: v })
//                   }}

//                 />
//                 <FormControl.ErrorMessage>{errors.token}</FormControl.ErrorMessage>
//               </FormControl>

//             </View>

//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 width: '100%',
//                 height: 60,
//                 backgroundColor: COLORS.white,
//               }}
//             >
//               <FormControl ml={5} mt={10} mb={10} isInvalid={!!errors.token}>
//                 <InputField
//                   title="Card Expiry Date"

//                   placeholderColor={COLORS.gray}
//                   // secureTextEntry={true}
//                   onchange={(v: string) => {
//                     setForm({ ...form, Card_Expiry_Date: v })
//                   }}

//                 />
//                 <FormControl.ErrorMessage>{errors.token}</FormControl.ErrorMessage>
//               </FormControl>

//             </View>

//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 width: '100%',
//                 height: 60,
//                 backgroundColor: COLORS.white,
//               }}
//             >
//               <FormControl ml={5} mt={10} mb={10} isInvalid={!!errors.token}>
//                 <InputField
//                   title="CVV"

//                   placeholderColor={COLORS.gray}
//                   // secureTextEntry={true}
//                   onchange={(v: string) => {
//                     setForm({ ...form, CVV: v })
//                   }}

//                 />
//                 <FormControl.ErrorMessage>{errors.token}</FormControl.ErrorMessage>
//               </FormControl>

//             </View>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 width: '100%',
//                 height: 60,
//                 backgroundColor: COLORS.white,
//               }}
//             >
//               <FormControl ml={5} mt={10} mb={10} isInvalid={!!errors.token}>
//                 <InputField
//                   title="ZIP Code"
//                   placeholderColor={COLORS.gray}
//                   // secureTextEntry={true}
//                   onchange={(v: string) => {
//                     setForm({ ...form, zip_code: v })
//                   }}

//                 />
//                 <FormControl.ErrorMessage>{errors.token}</FormControl.ErrorMessage>
//               </FormControl>

//             </View>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 width: '100%',
//                 height: 60,
//                 backgroundColor: COLORS.transparent,
//               }}
//             >
//               <TouchableOpacity
//                 style={{
//                   backgroundColor:
//                     COLORS.green,
//                   borderRadius: 50,
//                   marginLeft: 130
//                   // marginHorizontal: 5,
//                 }}
//                 onPress={() => addToken()}>
//                 <Text
//                   style={{
//                     paddingHorizontal: 36,
//                     paddingVertical: 6,
//                     lineHeight: 14 * 1.5,
//                     color: COLORS.white,
//                     fontFamily: 'Lato-Regular',
//                     fontSize: 14,
//                   }}>
//                   TopUp
//                 </Text>
//               </TouchableOpacity>

//             </View>
//           </View>
//         </Modal>
//         </ScrollView>
//     );
//   }
//   return (
//     <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
//       {renderHeader()}
//       {renderContent()}
//       {renderOptionModal()}
//     </SafeAreaView>
//   );
// }
