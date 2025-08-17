import React from 'react';
import {
  MaterialIcons,
  Feather,
  Entypo,
  AntDesign,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  Ionicons,
} from '@expo/vector-icons';
import { COLORS } from '../../constants';
import { MOBILE } from '../orientation';

export const EditIcon = (props: any) => (
  <Feather
    name="edit-3"
    size={MOBILE.iconSize.medium}
    color={COLORS.green}
    {...props}
  />
);

export const DeleteIcon = (props: any) => (
  <MaterialIcons
    name="delete"
    size={MOBILE.iconSize.vMedium}
    color={COLORS.red}
    {...props}
  />
);

export const ChevronUpIcon = (props: any) => (
  <Entypo name="chevron-up" size={24} color={COLORS.gray} {...props} />
);
export const ChevronDownIcon = (props: any) => (
  <Entypo name="chevron-down" size={24} color={COLORS.gray} {...props} />
);
export const SquareClose = (props: any) => (
  <AntDesign name="closesquareo" size={20} color={COLORS.red} {...props} />
);
export const SettingsIcon = (props: any) => (
  <MaterialIcons name="settings" size={24} color={COLORS.gray} {...props} />
);

export const RolesIcon = (props: any) => (
  <FontAwesome
    name="users"
    size={MOBILE.iconSize.VLarge}
    color={COLORS.gray}
    {...props}
  />
);

export const TokensIcon = (props: any) => (
  <FontAwesome5 name="coins" size={24} color={COLORS.gray} {...props} />
);

export const CloseIcon = (props: any) => (
  <FontAwesome
    name="close"
    size={MOBILE.iconSize.medium}
    color={COLORS.white}
    {...props}
  />
);

export const CashRegisterIcon = (props: any) => (
  <FontAwesome5
    name="cash-register"
    size={MOBILE.iconSize.xLarge}
    color={COLORS.black}
    {...props}
  />
);
export const KOBIcon = (props: any) => (
  <MaterialCommunityIcons
    name="food-turkey"
    size={MOBILE.iconSize.xLarge}
    color={COLORS.black}
    {...props}
  />
);
export const MenuIcon = (props: any) => (
  <MaterialCommunityIcons
    name="silverware-fork-knife"
    size={MOBILE.iconSize.xLarge}
    color={COLORS.black}
    {...props}
  />
);

export const PickUpIcon = (props: any) => (
  <MaterialCommunityIcons
    name="car-pickup"
    size={MOBILE.iconSize.xLarge}
    color={COLORS.black}
    {...props}
  />
);

export const OrderIcon = (props: any) => (
  <Ionicons
    name="cart-outline"
    size={MOBILE.iconSize.common}
    color={COLORS.green}
    {...props}
  />
);

export const EyeVisibleIcon = (props: any) => (
  <MaterialCommunityIcons
    name="eye-outline"
    size={MOBILE.iconSize.common}
    color={COLORS.gray}
    {...props}
  />
);

export const EyeVisibleOffIcon = (props: any) => (
  <MaterialCommunityIcons
    name="eye-off-outline"
    size={MOBILE.iconSize.common}
    color={COLORS.gray}
    {...props}
  />
);
