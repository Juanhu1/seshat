import * as React from 'react';
import PrimaryAppBar from "./primaryAppBar" ;

interface Props {
   brand: string ;
}

export default class Hello extends React.Component<Props, object> {
    render() {
      const { brand } = this.props;  
      return (
        <PrimaryAppBar brand={brand}></PrimaryAppBar>
      );
    }
  }

