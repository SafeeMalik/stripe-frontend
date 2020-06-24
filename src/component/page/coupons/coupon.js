import React, { Component } from 'react';
import { Label, Table, Button, Row, Col, Input } from 'reactstrap';
import axios from 'axios';

class Coupon extends Component {
    state = {
        couponList: [],
        perc_off: '',
        duration: ''
    }

    componentDidMount = () => {
        this.getCouponListing();
    }

    handleChange = (event) => {
        const value = event.target.value;
        this.setState({
            [event.target.name]: value
        })
    }

    getCouponListing = () => {
        axios.get(`http://localhost:3001/coupons/listCoupons`)
            .then(res => {
                this.setState({
                    couponList: res.data.data
                }, () => {
                    console.log('response object', res.data.data)
                })
            })
    }

    deleteCoupon = (id) => {
        console.log("delete function called with id: ", id)
        axios.delete(`http://localhost:3001/coupons/deleteCoupon`, {
            data: { couponID: id }
        })
            .then(res => {
                console.log('Coupon deleted', res.data)
                this.getCouponListing();
            })
    }

    createCoupon = () => {
        axios.post(`http://localhost:3001/coupons/createCoupon`, {
            perc_off: this.state.perc_off,
            duration_in_months: this.state.duration
        })
            .then(res => {
                console.log('Coupon created', res.data)
                this.getCouponListing();
                this.setState({
                    perc_off: '',
                    duration: ''
                })
            })
    }

    render() {
        const couponListing = this.state.couponList.map((coupon, index) => (
            <tr key={index}>
                <td>{coupon.percent_off}{" %"}</td>
                <td>{coupon.object}</td>
                <td>{coupon.duration_in_months}{" months"}</td>
                <td>
                    <Button type="button" onClick={() => this.deleteCoupon(coupon.id)}>Delete</Button>
                </td>
            </tr>
        ))

        return (
            <div>
                <Row>
                    <Col>
                        <Label>Coupons Page</Label>
                    </Col>
                </Row>

                <Row>
                    <Col md="10">
                        <Input type="text" name="perc_off" value={this.state.perc_off} placeholder="Enter percentage off amount" onChange={this.handleChange} />
                        <Input type="text" name="duration" value={this.state.duration} placeholder="Enter duration of coupon" onChange={this.handleChange} />
                        <Button type="button" className="btn btn-primary" onClick={this.createCoupon}>Add New</Button>
                    </Col>
                    <Col md="2"></Col>
                </Row>
                <Row>
                    <Col>
                        <Table dark striped border hover>
                            <thead>
                                <tr>
                                    <th>Percentage Off</th>
                                    <th>Name</th>
                                    <th>Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                {couponListing}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Coupon;