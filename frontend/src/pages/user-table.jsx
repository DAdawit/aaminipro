import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { authenticatedApi } from "../lib/axios-instance"
import axios from "axios"

export function UserTable() {
    const [users, setUsers] = useState([])
    const [error, setError] = useState('')
    const [successMsg, setSuccessMesg] = useState('')
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:4000/api/users')
            if (response.data) {
                setUsers(response.data)
            }

        } catch (error) {
            setError('Something go wrong')
        }
    }
    useEffect(() => {
        fetchUsers()
    }, [])
    // delete user
    console.log(users, 'users');

    const handleDelete = async (userId) => {
        const token = sessionStorage.getItem('token')
        try {
            const res = await authenticatedApi.delete(`/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            if (response.status !== '203') {
                return setError('Error on deleting Users')
            }
            const undeletedUsers = users.filter(user => user.id !== userId)
            setUsers(undeletedUsers)
            setSuccessMesg('The user is Succefully deleted.')
        } catch (error) {
            return setError('Error on deleting Users')
        }
    }
    let n = 1
    return (
        <Table className='w-[100%] border border-red-600'>
            <TableCaption>A list of Users.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-full">Number</TableHead>
                    <TableHead>full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Age</TableHead>
                    <TableHead className="text-right">Gender</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.user}>
                        <TableCell className="font-medium">{n++}</TableCell>
                        <TableCell><Link to={`/users/${user.id}`} className="hover:underline hover:text-blue-500">{user.fullname}</Link></TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="text-right">{user.age}</TableCell>
                        <TableCell className="text-right">{user.sex}</TableCell>

                        {/* New Action Column */}
                        <TableCell>
                            <div className="flex items-center justify-end gap-4">
                                <button
                                    onClick={() => handleDelete(user?.id)}
                                    className="px-2 bg-red-400 hover:bg-red-600 cursor-pointer text-white rounded-sm"
                                >
                                    Delete
                                </button>
                                <Link
                                    to={`/users/update/${user?.id}`}
                                    className="text-blue-500 hover:underline"
                                >
                                    Edit
                                </Link>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
