'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Card, CardContent } from '@/components/ui/card';

const data = [
  { day: 'Mon', minutes: 65 },
  { day: 'Tue', minutes: 59 },
  { day: 'Wed', minutes: 80 },
  { day: 'Thu', minutes: 81 },
  { day: 'Fri', minutes: 56 },
  { day: 'Sat', minutes: 120 },
  { day: 'Sun', minutes: 95 },
];

export function ActivityGraph() {
  return (
    <section>
        <SectionTitle>Weekly Watch Time</SectionTitle>
        <Card>
            <CardContent className="pt-6 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)"/>
                        <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}}/>
                        <YAxis unit="m" tickLine={false} axisLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}}/>
                        <Tooltip 
                            cursor={{fill: 'hsl(var(--secondary))'}}
                            contentStyle={{backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))'}}
                        />
                        <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    </section>
  );
}
