// Theme
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
  grey400, grey700,
  grey900,
  lightblue100, bluegrey400, bluegrey500,
  white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

const muiTheme = getMuiTheme({
  spacing: spacing,
  fontFamily: 'Lato, sans-serif',
  borderRadius: 2,
  palette: {
    primary1Color: grey400,
    primary2Color: grey700,
    primary3Color: bluegrey400,
    accent1Color: grey900,
    accent2Color: lightblue100,
    accent3Color: bluegrey500,
    textColor: darkBlack,
    secondaryTextColor: fade(darkBlack, 0.54),
    alternateTextColor: white,
    canvasColor: white,
    borderColor: bluegrey500,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: grey400,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
  },
});

export default muiTheme;