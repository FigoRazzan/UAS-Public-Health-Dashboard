import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TeamMemberCardProps {
    nrp: string;
    name: string;
    role: string;
    image?: string; // Optional image path
}

export const TeamMemberCard = ({ nrp, name, role, image }: TeamMemberCardProps) => {
    // Get initials for fallback
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-2 h-full flex flex-col">
            <CardHeader className="text-center flex-shrink-0">
                <div className="flex justify-center mb-4">
                    <Avatar className="w-24 h-24 border-4 border-primary/20 group-hover:border-primary/40 transition-colors">
                        {image && <AvatarImage src={image} alt={name} className="object-cover object-center" />}
                        <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <CardTitle className="text-lg">{name}</CardTitle>
                <CardDescription className="font-mono text-sm">{nrp}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center">
                <p className="text-sm text-muted-foreground text-center">{role}</p>
            </CardContent>
        </Card>
    );
};
