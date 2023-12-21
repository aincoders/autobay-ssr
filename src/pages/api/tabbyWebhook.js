import axios from 'axios';

export default async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).end('Method Not Allowed');
        return;
    }
    const data = req.body;
    console.log(data)

    if (data.status == 'authorized') {
        try {
            const formData = { ...data.meta, total_paid_amount: data.amount, payment_id: data.id, payment_gateway: 'Tabby', };
            const headers = { companyId: data.meta.companyId, applicationId: data.meta.applicationId, countryMasterId: data.meta.countryMasterId, regionMasterId: data.meta.regionMasterId, cityMasterId: data.meta.cityMasterId, workshopTypeId: data.meta.workshopTypeId, customerId: data.meta.customerId, token: 'b2905de7-0df5-44ee-f760-5a78be12e9d3', key: 'ccdb973a-7b1e-4f52-e3b7-4e9e59dfac67', deviceType: 'Web' }
            const response = await axios.postForm('https://api.okmechanic.store/customer/order/order_place', formData, { headers });
            if (response.status == 200) {
                const OrderResponse = response.data.result;
                try {
                    const notificationData = { customer_order_id: OrderResponse.customer_order_id }
                    await axios.postForm('https://api.okmechanic.store/customer/ordermail/order_placed_mail', notificationData, { headers });
                    console.log('Order Send Mail');
                } catch (error) {
                    console.log('Order Mail Error');
                    console.log(error.response.data.msg);
                }
                console.log('Order Placed success');
            }
        } catch (error) {
            console.log(error.response.data.msg);
            console.log('Order Placed error');
        }
    } else {
        console.log('current order status:', data.status);
    }
    res.status(200).end('OK');
};