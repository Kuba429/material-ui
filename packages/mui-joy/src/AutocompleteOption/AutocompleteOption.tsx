import * as React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { OverridableComponent } from '@mui/types';
import { unstable_capitalize as capitalize } from '@mui/utils';
import composeClasses from '@mui/base/composeClasses';
import { StyledListItemButton } from '../ListItemButton/ListItemButton';
import { styled, useThemeProps } from '../styles';
import autocompleteOptionClasses, {
  getAutocompleteOptionUtilityClass,
} from './autocompleteOptionClasses';
import { AutocompleteOptionOwnerState, AutocompleteOptionTypeMap } from './AutocompleteOptionProps';
import { useColorInversion } from '../styles/ColorInversion';

const useUtilityClasses = (ownerState: AutocompleteOptionOwnerState) => {
  const { color, variant } = ownerState;

  const slots = {
    root: [
      'root',
      color && `color${capitalize(color)}`,
      variant && `variant${capitalize(variant)}`,
    ],
  };

  return composeClasses(slots, getAutocompleteOptionUtilityClass, {});
};

export const StyledAutocompleteOption = styled(StyledListItemButton as unknown as 'li')<{
  ownerState: AutocompleteOptionOwnerState;
}>(({ theme, ownerState }) => ({
  '&[aria-disabled="true"]': theme.variants[`${ownerState.variant!}Disabled`]?.[ownerState.color!],
  '&[aria-selected="true"]': {
    color: theme.variants.soft?.[ownerState.color === 'context' ? 'context' : 'primary']?.color,
    backgroundColor:
      theme.variants.soft?.[ownerState.color === 'context' ? 'context' : 'primary']
        ?.backgroundColor,
    fontWeight: theme.vars.fontWeight.md,
  },
  [`&.${autocompleteOptionClasses.focused}:not([aria-selected="true"]):not(:hover)`]: {
    // create the focused style similar to the hover state
    backgroundColor:
      theme.variants[`${ownerState.variant!}Hover`]?.[ownerState.color!]?.backgroundColor,
  },
}));

const AutocompleteOptionRoot = styled(StyledAutocompleteOption, {
  name: 'JoyAutocompleteOption',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({});
/**
 *
 * Demos:
 *
 * - [Autocomplete](https://mui.com/joy-ui/react-autocomplete/)
 *
 * API:
 *
 * - [AutocompleteOption API](https://mui.com/joy-ui/api/autocomplete-option/)
 */
const AutocompleteOption = React.forwardRef(function AutocompleteOption(inProps, ref) {
  const props = useThemeProps<typeof inProps & { component?: React.ElementType }>({
    props: inProps,
    name: 'JoyAutocompleteOption',
  });

  const {
    children,
    component = 'li',
    color: colorProp = 'neutral',
    variant = 'plain',
    className,
    ...other
  } = props;
  const { getColor } = useColorInversion(variant);
  const color = getColor(inProps.color, colorProp);

  const ownerState = {
    ...props,
    component,
    color,
    variant,
  };

  const classes = useUtilityClasses(ownerState);

  return (
    <AutocompleteOptionRoot
      ref={ref}
      as={component}
      ownerState={ownerState}
      className={clsx(classes.root, className)}
      role="option"
      {...other}
    >
      {children}
    </AutocompleteOptionRoot>
  );
}) as OverridableComponent<AutocompleteOptionTypeMap>;

AutocompleteOption.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * @ignore
   */
  children: PropTypes.node,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The color of the component. It supports those theme colors that make sense for this component.
   * @default 'neutral'
   */
  color: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.oneOf(['danger', 'info', 'neutral', 'primary', 'success', 'warning']),
    PropTypes.string,
  ]),
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * The variant to use.
   * @default 'plain'
   */
  variant: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.oneOf(['contained', 'light', 'outlined', 'text']),
    PropTypes.string,
  ]),
} as any;

export default AutocompleteOption;
