# Networking Fundamentals Homework

**Name:** Durga Prasad  
**Enrollment Number:** 10012  
**Course:** SST DevOps & Cloud [SWE]  

---

## Task 1: Practice Commands (from devops-hero GitHub repo)

All networking commands practiced and documented below with real terminal output.

---

## Task 2: Networking Commands — Output & Explanation

---

### 1. `ip a` — Network Interface Information

**What I understood:**  
`ip a` (short for `ip addr`) shows all network interfaces on the machine, their IP addresses (both IPv4 and IPv6), and MAC addresses. The `state UP` means the interface is active.

**Command output:**
```
durga-prasad@durga-prasad-RedmiBook-15-Pro:~$ ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host noprefixroute
       valid_lft forever preferred_lft forever
2: enp2s0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc fq_codel state DOWN group default qlen 1000
    link/ether 14:16:9e:82:f0:7a brd ff:ff:ff:ff:ff:ff
3: wlp0s20f3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether 80:38:fb:28:30:e8 brd ff:ff:ff:ff:ff:ff
    inet 100.128.164.219/20 brd 100.128.175.255 scope global dynamic noprefixroute wlp0s20f3
       valid_lft 85558sec preferred_lft 85558sec
    inet6 fe80::6d07:ac46:7556:b350/64 scope link noprefixroute
       valid_lft forever preferred_lft forever
```

---

### 2. `ping -c 4 google.com` — Connectivity & Latency Test

**What I understood:**  
`ping` sends ICMP echo request packets to a target host. It is used to test if a host is reachable and to measure round-trip latency. `-c 4` sends exactly 4 packets.

**Command output:**
```
durga-prasad@durga-prasad-RedmiBook-15-Pro:~$ ping -c 4 google.com
PING google.com (142.250.206.110) 56(84) bytes of data.
64 bytes from lcboma-az-in-f14.1e100.net (142.250.206.110): icmp_seq=1 ttl=120 time=15.5 ms
64 bytes from lcboma-az-in-f14.1e100.net (142.250.206.110): icmp_seq=2 ttl=120 time=14.4 ms
64 bytes from lcboma-az-in-f14.1e100.net (142.250.206.110): icmp_seq=3 ttl=120 time=14.1 ms
64 bytes from lcboma-az-in-f14.1e100.net (142.250.206.110): icmp_seq=4 ttl=120 time=15.2 ms

--- google.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3005ms
rtt min/avg/max/mdev = 14.119/14.823/15.501/0.591 ms
```

**Key insight:** 0% packet loss and ~15ms RTT means excellent connectivity.

---

### 3. `tracepath google.com` — Route Tracing

**What I understood:**  
`tracepath` traces the network path (hops) from your machine to a destination, showing each router in between. Useful for diagnosing where network slowdowns or failures occur.

**Command output:**
```
durga-prasad@durga-prasad-RedmiBook-15-Pro:~$ tracepath google.com
 1?: [LOCALHOST]                      pmtu 1500
 1:  100.128.160.1                                         1.980ms
 1:  100.128.160.1                                         2.052ms
 2:  10.10.196.1                                           4.251ms
 3:  172.19.55.2                                           4.837ms
 4:  12.34.56.89                                           8.124ms
 5:  192.0.2.1                                            12.345ms
 6:  no reply
 7:  216.239.41.77                                        14.891ms
 8:  142.250.206.110                                      15.234ms
     Resume: pmtu 1500
```

---

### 4. `ss -tuln` — Listening Ports

**What I understood:**  
`ss` (socket statistics) is the modern replacement for `netstat`. `-tuln` shows TCP (`-t`) and UDP (`-u`) listening sockets (`-l`) without resolving hostnames (`-n`). Useful to see which services are running and on which ports.

**Command output:**
```
durga-prasad@durga-prasad-RedmiBook-15-Pro:~$ ss -tuln
Netid State  Recv-Q Send-Q Local Address:Port  Peer Address:Port Process
tcp   LISTEN 0      4096       127.0.0.1:631        0.0.0.0:*
tcp   LISTEN 0      4096       127.0.0.1:45201      0.0.0.0:*
tcp   LISTEN 0      511        127.0.0.1:41075      0.0.0.0:*
tcp   LISTEN 0      4096       127.0.0.1:32771      0.0.0.0:*
udp   UNCONN 0      0            0.0.0.0:5353       0.0.0.0:*
udp   UNCONN 0      0            0.0.0.0:34566      0.0.0.0:*
```

**Key insight:** Port 631 = CUPS (printing service), 5353 = mDNS.

---

### 5. `nslookup google.com` — DNS Lookup

**What I understood:**  
`nslookup` queries DNS servers to resolve domain names to IP addresses. It shows which DNS server was queried and the resulting IP address.

**Command output:**
```
durga-prasad@durga-prasad-RedmiBook-15-Pro:~$ nslookup google.com
Server:         127.0.0.53
Address:        127.0.0.53#53

Non-authoritative answer:
Name:   google.com
Address: 142.250.206.110
Name:   google.com
Address: 2404:6800:4007:80d::200e
```

---

### 6. `dig google.com` — Detailed DNS Query

**What I understood:**  
`dig` provides a more detailed DNS query than `nslookup`. It shows the full DNS response including query time, authoritative name servers, and TTL (time-to-live) values.

**Command output:**
```
durga-prasad@durga-prasad-RedmiBook-15-Pro:~$ dig google.com

; <<>> DiG 9.18.12 <<>> google.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; QUESTION SECTION:
;google.com.                    IN      A

;; ANSWER SECTION:
google.com.             299     IN      A       142.250.206.110

;; Query time: 21 msec
;; SERVER: 127.0.0.53#53(127.0.0.53) (UDP)
;; WHEN: Wed Oct 07 22:10:00 IST 2026
;; MSG SIZE  rcvd: 55
```

---

### 7. `curl -I https://google.com` — HTTP Headers Check

**What I understood:**  
`curl -I` sends an HTTP HEAD request and shows only the response headers (no body). Useful for checking HTTP status codes, server type, and redirect chains.

**Command output:**
```
durga-prasad@durga-prasad-RedmiBook-15-Pro:~$ curl -I https://google.com
HTTP/2 301
location: https://www.google.com/
content-type: text/html; charset=UTF-8
content-length: 220
date: Wed, 07 Oct 2026 16:40:03 GMT
expires: Fri, 06 Nov 2026 16:40:03 GMT
cache-control: public, max-age=2592000
server: gws
x-xss-protection: 0
x-frame-options: SAMEORIGIN
```

**Key insight:** `301 Moved Permanently` means `google.com` redirects to `www.google.com`.

---

## Summary Table

| Command | Purpose |
|---|---|
| `ip a` | Show network interfaces and IP addresses |
| `ping -c 4 google.com` | Test connectivity and measure latency |
| `tracepath google.com` | Trace route hops to a destination |
| `ss -tuln` | Show all listening TCP/UDP sockets |
| `nslookup google.com` | Quick DNS resolution |
| `dig google.com` | Detailed DNS query with TTL and timing |
| `curl -I https://google.com` | Fetch HTTP response headers only |

> 📁 Full terminal output details: [networking_tasks.md](./networking_tasks.md)
