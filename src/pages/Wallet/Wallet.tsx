import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import StatsGrid from "../../components/dashboard/StatsGrid";
import FiltersBar from "../../components/ui/FiltersBar";
import TransactionsTable, { type Transaction } from "../../components/wallet/TransactionsTable";
import TransactionDetailsDialog from "../../components/wallet/TransactionDetailsDialog";
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
import { downloadReport } from "../../utils/download";
import { useTranslation } from "react-i18next";
import useLocale from "../../i18n/useLocale";

export default function Wallet() {
  const { t } = useTranslation();
  const { formatCurrency } = useLocale();
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
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
        search={{ value: search, onChange: setSearch, placeholder: t("filters.searchTransaction") }}
        fields={[
          { key: "from", type: "date", value: dateFrom, onChange: setDateFrom },
          { key: "to", type: "date", value: dateTo, onChange: setDateTo },
          { key: "status", type: "select", value: status, onChange: setStatus, placeholder: t("filters.selectStatus"), options: transactionStatusOptions },
          { key: "service", type: "select", value: service, onChange: setService, placeholder: t("filters.serviceType"), options: transactionServiceOptions },
          { key: "paymentType", type: "select", value: paymentType, onChange: setPaymentType, placeholder: t("filters.paymentType"), options: paymentTypeOptions },
        ]}
      />

      <TransactionsTable
        rows={filteredTransactions}
        onView={setSelectedTransaction}
        onRefund={(transaction) => {
          setTransactions((current) => current.map((item) => item.id === transaction.id ? { ...item, type: "استرداد", status: "في الانتظار" } : item));
          toast.success(t("messages.refundSent"));
        }}
        onDownload={(transaction) => {
          downloadReport(`${transaction.transactionNo.replace("#", "")}-receipt.txt`, [
            [t("finance.transactionNumber"), transaction.transactionNo],
            [t("tables.orderNumber"), transaction.orderNo],
            [t("tables.customer"), transaction.customer],
            [t("tables.provider"), transaction.provider],
            [t("finance.amount"), formatCurrency(transaction.amount)],
            [t("common.status"), transaction.status],
          ]);
          toast.success(t("messages.receiptDownloaded"));
        }}
      />

      <WithdrawalRequests requests={withdrawalRequests} />

      <TransactionDetailsDialog transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />
    </section>
  );
}
