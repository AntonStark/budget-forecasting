import PaymentsTableLayout from "@/shared/components/PaymentsTableLayout";

export default function Layout({ children }) {

  return (
    <PaymentsTableLayout>
      {children}
    </PaymentsTableLayout>
  );
}
