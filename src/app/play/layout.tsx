import { SocketProvider } from "./hooks/useSocket";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <SocketProvider>{children}</SocketProvider>;
}
