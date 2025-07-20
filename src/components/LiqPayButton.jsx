import React, { useEffect, useRef } from "react";
import axios from "axios";

const LiqPayButton = ({ bookingId, isCancelled }) => {
    const buttonRef = useRef(null);

    useEffect(() => {
        const loadLiqPay = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                const res = await axios.get(` http://localhost:8000/cabinet/api/pay-liqpay/${bookingId}/`, { headers });

                const { data, signature } = res.data;

                const form = document.createElement("form");
                form.method = "POST";
                form.action = "https://www.liqpay.ua/api/3/checkout";
                form.acceptCharset = "utf-8";

                form.innerHTML = `
                    <input type="hidden" name="data" value="${data}" />
                    <input type="hidden" name="signature" value="${signature}" />
                    <div class="flex justify-center ${isCancelled ? "border-gray-200 hover:bg-gray-100 text-gray-600" : "border-[#361d32]/60 hover:bg-[#543c52] hover:text-[#f1e8e6]"} border-2 flex-1 rounded-xl px-4 py-2">
                      <button
                        type="submit"
                        ${isCancelled ? 'disabled' : ''}
                        class="${isCancelled ? 'text-gray-600 cursor-not-allowed' : ''}"
                      >
                        ${isCancelled ? 'Тур скасовано' : 'Оплатити'}
                      </button>
                    </div>
                `;

                buttonRef.current.innerHTML = "";
                buttonRef.current.appendChild(form);
            } catch (err) {
                console.error("LiqPay init error:", err);
            }
        };

        loadLiqPay();
    }, [bookingId, isCancelled]);

    return (
        <div ref={buttonRef}>
            <p>Завантаження кнопки...</p>
        </div>
    );
};

export default LiqPayButton;
