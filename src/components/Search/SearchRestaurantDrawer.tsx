import { Box } from '@chakra-ui/react';
import { css } from '@emotion/react';
import SearchRestaurantContent from 'components/Search/SearchRestaurantContent';
import SearchRestaurantDrawerHeader from 'components/Search/SearchRestaurantDrawerHeader';
import { useDragDrawer } from 'hooks/useDragDrawer';
import { useWindowHeight } from 'hooks/useWindowHeight';
import { useRecoilValue } from 'recoil';
import {
  foodPartyCreateDrawerInitState,
  foodPartyCreateDrawerOpenState,
} from 'stores/drawer';

const SearchRestaurantDrawer = () => {
  const { drawer, content } = useDragDrawer();
  const { windowHeight } = useWindowHeight();
  const foodPartyCreateDrawerOpen = useRecoilValue(foodPartyCreateDrawerOpenState);
  const isInit = useRecoilValue(foodPartyCreateDrawerInitState);

  return (
    <Box
      ref={drawer}
      css={css`
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 11;
        display: ${isInit ? 'none' : 'flex'};
        flex-direction: column;
        width: min(100vw, 560px);
        height: ${windowHeight - 120}px;
        background-color: #fff;
        border-top: 0px 0px 10px rgba(0, 0, 0, 0.6);
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        transform: ${foodPartyCreateDrawerOpen
          ? 'translateY(120px)'
          : 'translateY(800px)'};
        animation: 0.5s ease-in-out
          ${foodPartyCreateDrawerOpen ? 'openModal' : 'closeModal'};
        @keyframes openModal {
          from {
            transform: translateY(${windowHeight - 120}px);
          }
          to {
            transform: translateY(120px);
          }
        }
        @keyframes closeModal {
          from {
            transform: translateY(120px);
          }
          to {
            transform: translateY(${windowHeight - 120}px);
          }
        }
      `}>
      <SearchRestaurantDrawerHeader />
      <Box
        ref={content}
        css={css`
          height: 100%;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
        `}>
        <Box pos='relative' h='100%'>
          <SearchRestaurantContent />
        </Box>
      </Box>
    </Box>
  );
};

export default SearchRestaurantDrawer;
