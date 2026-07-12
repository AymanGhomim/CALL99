import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import StatsGrid from "../../components/dashboard/StatsGrid";
import FiltersBar from "../../components/ui/FiltersBar";
import TransactionsTable, { type Transaction } from "../../components/wallet/TransactionsTable";
import WalletHeader from "../../components/wallet/WalletHeader";
import WithdrawalRequests from "../../components/wallet/WithdrawalRequests";
import {
  initialTransactions,
  paymentTypeOptions,
  transactionServiceOptions,
  transactionStatusOptions,
  walletStats,
  withdrawalRequests,
} from "../../data/wallet.data";

export default function Wallet() {
  const [transactions] = useState<Transaction[]>(initialTransactions);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [status, setStatus] = useState("");
  const [service, setService] = useState("");
  const [paymentType, setPaymentType] = useState("");

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((transaction) => {
        const query = search.trim().toLowerCase();
        const matchesSearch =
          !query ||
          transaction.transactionNo.toLowerCase().includes(query) ||
          transaction.orderNo.toLowerCase().includes(query) ||
          transaction.customer.toLowerCase().includes(query) ||
          transaction.provider.toLowerCase().includes(query);
        const matchesStatus = !status || transaction.status === status;
        const matchesService = !service || transaction.service === service;
        const matchesType = !paymentType || transaction.type === paymentType;
        const matchesDateFrom = !dateFrom || transaction.createdDate >= dateFrom;
        const matchesDateTo = !dateTo || transaction.createdDate <= dateTo;
        return matchesSearch && matchesStatus && matchesService && matchesType && matchesDateFrom && matchesDateTo;
      }),
    [dateFrom, dateTo, paymentType, search, service, status, transactions],
  );

  return (
    <section>
      <WalletHeader />

      <div className="mb-7">
        <StatsGrid stats={walletStats} />
      </div>

      <FiltersBar
        search={{ value: search, onChange: setSearch, placeholder: "ابحث بالاسم أو رقم الطلب أو المعاملة" }}
        fields={[
          { key: "from", type: "date", value: dateFrom, onChange: setDateFrom },
          { key: "to", type: "date", value: dateTo, onChange: setDateTo },
          { key: "status", type: "select", value: status, onChange: setStatus, placeholder: "اختر الحالة", options: transactionStatusOptions },
          { key: "service", type: "select", value: service, onChange: setService, placeholder: "نوع الخدمة", options: transactionServiceOptions },
          { key: "paymentType", type: "select", value: paymentType, onChange: setPaymentType, placeholder: "نوع الدفع", options: paymentTypeOptions },
        ]}
      />

      <TransactionsTable
        rows={filteredTransactions}
        onView={() => toast("عرض تفاصيل المعاملة")}
        onRefund={() => toast.success("تم إرسال طلب الاسترداد")}
        onDownload={() => toast.success("تم تجهيز إيصال المعاملة")}
      />

      <WithdrawalRequests requests={withdrawalRequests} />
    </section>
  );
}
