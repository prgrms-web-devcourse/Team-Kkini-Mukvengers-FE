import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import { AiOutlineCrown } from 'react-icons/ai';
import { Member } from 'types/foodParty';

const FoodPartyMemberItem = ({ member }: { member: Member }) => {
  return (
    <Box position='relative' padding='0.5rem 0'>
      <Flex alignItems='center' justifyContent='space-between'>
        <Flex alignItems='center' gap='1rem'>
          <Avatar src={member.avatarUrl} />
          <Text>{member.userName}</Text>
        </Flex>
        {member.role === 'LEADER' && <AiOutlineCrown />}
      </Flex>
    </Box>
  );
};

export default FoodPartyMemberItem;