import psycopg2
import urllib.parse

regions = ['ap-south-1', 'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'sa-east-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-central-1', 'eu-central-2', 'ap-northeast-1', 'ap-northeast-2', 'ap-southeast-1', 'ap-southeast-2', 'ca-central-1', 'ap-east-1']
passwords = ['civicai', 'feca&Q9*7muNUXg']
ref = 'ezaierqywmjgknrkxxwd'
ports = [5432, 6543]

success = False
for port in ports:
    if success: break
    for pw_raw in passwords:
        pw = urllib.parse.quote(pw_raw)
        if success: break
        for region in regions:
            url = f'postgresql://postgres.{ref}:{pw}@aws-0-{region}.pooler.supabase.com:{port}/postgres'
            try:
                conn = psycopg2.connect(url, connect_timeout=3)
                print(f'\n--- SUCCESS! USE THIS URL: ---\n{url}\n------------------------------')
                conn.close()
                success = True
                break
            except psycopg2.OperationalError as e:
                err_str = str(e)
                if 'Tenant or user not found' not in err_str and 'timeout' not in err_str:
                    print(f'Port {port} Region {region} pw {pw_raw} Error: {err_str.strip()}')
            except Exception as e:
                print(f'Port {port} Region {region} Exception: {str(e).strip()}')

if not success:
    print('Failed to find working pooler URL.')
