import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import { AiOutlineCrown } from 'react-icons/ai';
import { Member } from 'types/foodParty';

const FoodPartyMemberItem = ({ member }: { member: Member }) => {
  return (
    <Box position='relative' padding='0.25rem 0'>
      <Flex alignItems='center' justifyContent='space-between'>
        <Flex alignItems='center' gap='0.5rem'>
          <Avatar src={member.profileImgUrl} size='sm' />
          <Text fontSize='14px'>{member.nickname}</Text>
        </Flex>
        {member.crewMemberRole === 'LEADER' && (
          <Flex border='1px solid' borderRadius='50%' padding='0.25rem'>
            <AiOutlineCrown />
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default FoodPartyMemberItem;
