import { Flex, FlexProps } from '@chakra-ui/react';
import styled from '@emotion/styled';
import React, { ReactNode } from 'react';

type Props = {
  width?: string;
  height?: string;
  style?: FlexProps;
  children?: ReactNode;
};

const Button = ({ width = '100%', height = '3rem', ...props }: Props) => {
  return (
    <ButtonContainer
      as='button'
      align='center'
      justify='center'
      w={width}
      h={height}
      borderRadius='8px'
      {...props.style}>
      {props.children}
    </ButtonContainer>
  );
};

const ButtonContainer = styled(Flex)`
  cursor: pointer;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      filter: brightness(0.9);
    }
  }
`;

export default Button;
