import React, { ReactNode } from 'react';
import Modal from 'react-native-modal';
import { MODAL_ANIMATION } from '../constants/theme';
import { deviceHeight, deviceWidth } from '../utils/orientation';
import Styles from '../utils/styles';

interface PopUpModalProps {
  children: ReactNode;
  onClose: () => void;
  open: boolean;
  swipeDirection?: 'up' | 'down' | 'left' | 'right';
}

const PopUpModal: React.FC<PopUpModalProps> = ({
  children,
  onClose,
  open,
  swipeDirection = MODAL_ANIMATION.DOWN,
}) => (
  <Modal
    isVisible={open}
    animationOutTiming={100}
    backdropOpacity={0.5}
    style={Styles.modal}
    animationIn={MODAL_ANIMATION.SLIDE_IN_UP}
    animationOut={MODAL_ANIMATION.SLIDE_IN_DOWN}
    onBackdropPress={onClose}
    swipeDirection={swipeDirection}
    onSwipeComplete={onClose}
    onBackButtonPress={onClose}
    deviceHeight={deviceHeight}
    deviceWidth={deviceWidth}
    propagateSwipe>
    {children}
  </Modal>
);

export default PopUpModal;
