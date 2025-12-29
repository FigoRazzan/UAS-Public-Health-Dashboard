import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface TeamMemberCardProps {
    nrp: string;
    name: string;
    role: string;
}

export const TeamMemberCard = ({ nrp, name, role }: TeamMemberCardProps) => {
    // Get initials from name
    const getInitials = (fullName: string) => {
        const names = fullName.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return fullName.substring(0, 2).toUpperCase();
    };

    return (
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <Avatar className="w-20 h-20 border-4 border-primary/20 group-hover:border-primary/40 transition-colors">
                        <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                            {getInitials(name)}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <CardTitle className="text-lg">{name}</CardTitle>
                <CardDescription className="font-mono text-sm">{nrp}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground text-center">{role}</p>
            </CardContent>
        </Card>
    );
};
