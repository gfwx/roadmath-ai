export async function FormGenerateWrapper({ children }: { children: React.ReactNode }) {
  return (
    <form>
      {children}
    </form>
  );
}
