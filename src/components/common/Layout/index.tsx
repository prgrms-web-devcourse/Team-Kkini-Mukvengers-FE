import { Box, ChakraProvider, Flex } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import Header from 'components/common/Layout/Header';
import Navigation from 'components/common/Layout/Navigation';
import SearchRestaurantDrawer from 'components/Search/SearchRestaurantDrawer';
import { ReactNode, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { silentLogin } from 'services/auth';
import { isCheckingRefreshTokenState, isLoginState } from 'stores/auth';
import theme from 'styles/chakraTheme';
import { BaseFont } from 'styles/fonts';
import globalStyle from 'styles/global';

const Layout = ({ children }: { children: ReactNode }) => {
  const setLoginState = useSetRecoilState(isLoginState);
  const setIsCheckingRefreshToken = useSetRecoilState(isCheckingRefreshTokenState);

  useEffect(() => {
    (async () => {
      try {
        const token = await silentLogin();
        token && setLoginState(true);
      } finally {
        setIsCheckingRefreshToken(true);
      }
    })();
  }, []);

  return (
    <ChakraProvider resetCSS theme={theme}>
      <Global styles={globalStyle} />
      <Flex
        flexDirection='column'
        id='app'
        pos='relative'
        className={BaseFont.className}
        overflow='hidden'>
        <Header />
        {/* To Do: 스크롤바 스타일링 필요 by 승준 */}
        <Box as='main' flex={1} pos='relative' overflowX='hidden' overflowY='auto'>
          {children}
        </Box>
        <SearchRestaurantDrawer />
        <Navigation />
      </Flex>
    </ChakraProvider>
  );
};

export default Layout;
