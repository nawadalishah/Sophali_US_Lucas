import { StyleSheet } from 'react-native';
import { deviceHeight, deviceWidth, IS_PAD } from '../orientation';
import { COLORS } from '../../constants';
import { scaleSize } from '../mixins';

const Styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flex06: {
    flex: 0.6,
  },
  flex04: {
    flex: 0.4,
  },
  flex08: {
    flex: 0.8,
  },
  flex2: {
    flex: 2,
  },
  flex3: {
    flex: 3,
  },
  flex4: {
    flex: 4,
  },

  pL10: {
    paddingLeft: scaleSize(10),
  },
  pL5: {
    paddingLeft: scaleSize(5),
  },
  pL15: {
    paddingLeft: scaleSize(15),
  },
  pL20: {
    paddingLeft: scaleSize(20),
  },
  pL25: {
    paddingLeft: scaleSize(25),
  },
  pR10: {
    paddingRight: scaleSize(10),
  },
  pR12_5: {
    paddingRight: scaleSize(12.5),
  },
  pR5: {
    paddingRight: scaleSize(5),
  },
  pR15: {
    paddingRight: scaleSize(15),
  },
  pR20: {
    paddingRight: scaleSize(20),
  },
  pR25: {
    paddingRight: scaleSize(25),
  },
  pR30: {
    paddingRight: scaleSize(30),
  },
  opacity05: {
    opacity: 0.5,
  },
  opacity08: {
    opacity: 0.8,
  },
  opacity1: {
    opacity: 1,
  },
  pB5: { paddingBottom: scaleSize(5) },
  pT5: { paddingTop: scaleSize(5) },
  pB10: { paddingBottom: scaleSize(10) },
  pT10: { paddingTop: scaleSize(10) },
  pT15: { paddingTop: scaleSize(15) },
  pB15: { paddingBottom: scaleSize(15) },
  pB20: { paddingBottom: scaleSize(20) },
  pB25: { paddingBottom: scaleSize(25) },
  pB65: { paddingBottom: scaleSize(65) },
  pB75: { paddingBottom: scaleSize(75) },
  pT20: { paddingTop: scaleSize(20) },
  pT25: { marginTop: scaleSize(25) },
  pT30: { marginTop: scaleSize(30) },
  mT40: { marginTop: scaleSize(40) },

  mH10: { marginHorizontal: scaleSize(10) },
  mH15: { marginHorizontal: scaleSize(15) },
  mH20: { marginHorizontal: scaleSize(20) },
  mH25: { marginHorizontal: scaleSize(25) },
  mR5: { marginRight: scaleSize(5) },
  mL5: { marginLeft: scaleSize(5) },
  mR10: { marginRight: scaleSize(10) },
  mR12_5: { marginRight: scaleSize(12.5) },
  mL10: { marginLeft: scaleSize(10) },
  mR20: { marginRight: scaleSize(20) },
  mL20: { marginLeft: scaleSize(20) },
  mR15: { marginRight: scaleSize(15) },
  mL15: { marginLeft: scaleSize(15) },
  mH5: { marginHorizontal: scaleSize(5) },
  mV5: { marginVertical: scaleSize(5) },

  mT10: { marginTop: scaleSize(10) },
  mT12_5: { marginTop: scaleSize(12.5) },
  mT15: { marginTop: scaleSize(15) },
  mT20: { marginTop: scaleSize(20) },
  mT25: { marginTop: scaleSize(25) },
  mT30: { marginTop: scaleSize(30) },
  mT50: { marginTop: scaleSize(50) },
  mT45: { marginTop: scaleSize(45) },
  mT24: { marginTop: scaleSize(24) },

  mT5: { marginTop: scaleSize(5) },
  mT2: { marginTop: scaleSize(2) },
  mB5: { marginBottom: scaleSize(5) },
  mB3: { marginBottom: scaleSize(3) },
  mB10: { marginBottom: scaleSize(10) },
  mB15: { marginBottom: scaleSize(15) },
  mB20: { marginBottom: scaleSize(20) },
  mB25: { marginBottom: scaleSize(25) },
  mV10: { marginVertical: scaleSize(10) },
  mV15: { marginVertical: scaleSize(15) },
  mV25: { marginVertical: scaleSize(25) },
  mV20: { marginVertical: scaleSize(20) },

  pB30: { paddingBottom: scaleSize(30) },
  mB30: { marginBottom: scaleSize(30) },
  pV1: {
    paddingVertical: scaleSize(1),
  },
  pV5: {
    paddingVertical: scaleSize(5),
  },
  pV10: {
    paddingVertical: scaleSize(10),
  },
  pV12_5: {
    paddingVertical: scaleSize(10),
  },
  pV15: {
    paddingVertical: scaleSize(15),
  },
  pV20: {
    paddingVertical: scaleSize(20),
  },
  pV25: {
    paddingVertical: scaleSize(25),
  },
  pH5: {
    paddingHorizontal: scaleSize(5),
  },
  pH10: {
    paddingHorizontal: scaleSize(10),
  },
  pH12_5: {
    paddingHorizontal: scaleSize(12.5),
  },
  pH15: {
    paddingHorizontal: scaleSize(15),
  },
  pH20: {
    paddingHorizontal: scaleSize(20),
  },
  pH25: {
    paddingHorizontal: scaleSize(25),
  },
  p5: { padding: scaleSize(5) },
  p10: { padding: scaleSize(10) },
  p15: { padding: scaleSize(15) },
  p20: { padding: scaleSize(20) },
  pH30: {
    paddingHorizontal: scaleSize(30),
  },

  pB85: { paddingBottom: scaleSize(90) },
  pB55: { paddingBottom: scaleSize(55) },
  pH17: {
    paddingHorizontal: scaleSize(17),
  },
  justifyContentStart: {
    justifyContent: 'flex-start',
  },
  alignItemsStart: {
    alignItems: 'flex-start',
  },
  alignItemsEnd: {
    alignItems: 'flex-end',
  },
  fend: {
    alignSelf: 'flex-end',
  },
  flexWrap: {
    flexWrap: 'wrap',
  },
  flexGrow: {
    flexGrow: 1,
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  justifyContentSpaceBetween: {
    justifyContent: 'space-between',
  },
  mainWrapper: {
    paddingLeft: IS_PAD ? deviceWidth / 5 : scaleSize(20),
    paddingRight: IS_PAD ? deviceWidth / 5 : scaleSize(20),
    paddingVertical: scaleSize(20),
  },
  alignContentCenter: {
    alignContent: 'center',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexCenterEnd: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  flexCenterStart: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  flexContentEnd: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  flex2Start: {
    flex: 2,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  flex3End: {
    flex: 3,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  loadingBackground: {
    backgroundColor: COLORS.black,
  },
  flexDirectionColumn: {
    flexDirection: 'column',
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  L8: {
    left: 8,
  },
  L3: {
    left: 3,
  },

  mB120: { marginBottom: scaleSize(120) },
  mV2: { marginVertical: scaleSize(2) },
  positionRelative: { position: 'relative' },
  positionAbsolute: { position: 'absolute' },
  zI100: {
    zIndex: 100,
  },
  h100: { height: '100%' },
  h10: { height: scaleSize(10) },
  h20: { height: scaleSize(20) },
  h50: { height: '50%' },
  h60: { height: scaleSize(60) },
  h85: { height: scaleSize(85) },
  h40: { height: '40%' },
  w50: { width: '50%' },
  w80: { width: '80%' },
  w40: { width: '40%' },
  w30: { width: '30%' },
  w48: { width: '48%' },
  w60: { width: '60%' },
  w70: { width: '70%' },
  w20: { width: '20%' },

  rowFlexEnd: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  textCenter: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  textTransformCap: {
    textTransform: 'capitalize',
  },
  textTransformUpper: {
    textTransform: 'uppercase',
  },
  Centered: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  w100: {
    width: '100%',
    height: '10%',
  },
  r25: {
    right: 25,
  },
  r22: {
    right: 22,
  },
  backDropLoader: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: COLORS.blackOverlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyComponent: {
    justifyContent: 'center',
    alignItems: 'center',
    height: deviceHeight / 1.14,
  },
  primaryBackground: {
    backgroundColor: COLORS.white,
  },

  modal: {
    margin: 0,
    marginTop: 0,
    marginBottom: 0,
    height: deviceHeight,
  },
});
export default Styles;
