import {
  Table as ChakraTable,
  type SystemStyleObject,
  type TableRootProps as ChakraTableRootProps,
} from '@chakra-ui/react'
import * as React from 'react'

export interface TableRootProps extends ChakraTableRootProps {
  interactive?: boolean
  striped?: boolean
}

export const TableRoot = React.forwardRef<HTMLTableElement, TableRootProps>(
  function TableRoot({ interactive = true, striped = false, css, ...props }, ref) {
    const tableStyles: SystemStyleObject = {
      bg: 'app.surface',
      borderCollapse: 'separate',
      borderColor: 'app.border',
      borderRadius: 'md',
      borderSpacing: '0',
      borderWidth: '1px',
      overflow: 'hidden',
      shadow: 'xs',
      width: '100%',
      '& thead': {
        bg: 'app.well',
      },
      '& th': {
        bg: 'app.well',
        borderColor: 'app.border',
        borderBottomWidth: '1px',
        color: 'fg.muted',
        fontFamily: 'mono',
        fontSize: '2xs',
        fontWeight: 'medium',
        letterSpacing: 'wide',
        px: '3.5',
        py: '2.5',
        textAlign: 'start',
      },
      '& td': {
        borderColor: 'app.border',
        borderBottomWidth: '1px',
        color: 'fg',
        fontSize: 'sm',
        px: '3.5',
        py: '2.5',
        verticalAlign: 'middle',
      },
      '& tbody tr:last-of-type td': {
        borderBottomWidth: '0',
      },
    }

    if (interactive) {
      tableStyles['& tbody tr'] = {
        transition: 'background-color 0.15s ease',
        _hover: {
          bg: 'app.spot',
        },
      }
    }

    if (striped) {
      tableStyles['& tbody tr:nth-of-type(even)'] = {
        bg: 'app.well',
      }
    }

    return (
      <ChakraTable.Root
        ref={ref}
        css={[tableStyles, css]}
        {...props}
      />
    )
  },
)

export const TableHeader = ChakraTable.Header
export const TableBody = ChakraTable.Body

export interface TableRowProps extends ChakraTable.RowProps {}
export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow(props, ref) {
    return <ChakraTable.Row ref={ref} borderColor="app.border" {...props} />
  },
)

export interface TableColumnHeaderProps extends ChakraTable.ColumnHeaderProps {}
export const TableColumnHeader = React.forwardRef<HTMLTableCellElement, TableColumnHeaderProps>(
  function TableColumnHeader(props, ref) {
    return (
      <ChakraTable.ColumnHeader
        ref={ref}
        bg="app.well"
        borderColor="app.border"
        color="fg.muted"
        fontFamily="mono"
        fontSize="2xs"
        fontWeight="medium"
        letterSpacing="wide"
        px="3.5"
        py="2.5"
        {...props}
      />
    )
  },
)

export interface TableCellProps extends ChakraTable.CellProps {}
export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell(props, ref) {
    return (
      <ChakraTable.Cell
        ref={ref}
        borderColor="app.border"
        color="fg"
        fontSize="sm"
        px="3.5"
        py="2.5"
        {...props}
      />
    )
  },
)

export interface TableCaptionProps extends ChakraTable.CaptionProps {}
export const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  function TableCaption(props, ref) {
    return (
      <ChakraTable.Caption
        ref={ref}
        color="fg.muted"
        fontFamily="mono"
        fontSize="2xs"
        letterSpacing="wide"
        mt="2"
        {...props}
      />
    )
  },
)

export interface TableFooterProps extends ChakraTable.FooterProps {}
export const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  function TableFooter(props, ref) {
    return (
      <ChakraTable.Footer
        ref={ref}
        bg="app.well"
        borderColor="app.border"
        borderTopWidth="1px"
        color="fg.muted"
        fontSize="xs"
        {...props}
      />
    )
  },
)

export const TableScrollArea = ChakraTable.ScrollArea
