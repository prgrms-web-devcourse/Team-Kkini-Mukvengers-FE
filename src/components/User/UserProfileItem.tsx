import { Box, Flex, Text } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

type UserProfileItemProps = {
  name: string;
} & PropsWithChildren;

const UserProfileItem = ({ name, children }: UserProfileItemProps) => {
  return (
    <Flex h='5rem' direction='column' gap='0.5rem' mt='1rem'>
      <Text fontWeight={600} fontSize='lg'>
        {name}
      </Text>
      <Box>{children}</Box>
    </Flex>
  );
};

export default UserProfileItem;
